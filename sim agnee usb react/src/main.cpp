#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// Pin Definitions
const int TEMP_PINS[] = {2, 4, 5, 18, 19}; // DS18B20 data pins
#define ACS758_PIN1 12             // ACS758 #1 analog out
#define ACS758_PIN2 13             // ACS758 #2 analog out
#define ZMPT101B_PIN 14            // ZMPT101B analog out
#define BLUE_PWM_PIN 25            // Blue light PWM
#define RED_PWM_PIN 26             // Red light PWM
const int RELAY_PINS[] = {27, 28, 29, 30, 31, 32, 33}; // 7 relays
#define BUZZER_PIN 15              // Buzzer
#define ESTOP_PIN 34               // Emergency Stop
#define HEARTBEAT_PIN 16           // ATTiny85 heartbeat
#define USER_FAN_PIN 25            // User fan PWM (shared with blue)
#define MACHINE_FAN_PIN 26         // Machine fan PWM (shared with red)

// Constants
#define TEMP_SENSOR_COUNT 5
#define PWM_FREQ_LIGHT 2000        // 2 kHz for lights
#define PWM_FREQ_FAN 25000         // 25 kHz for fans
#define PWM_RESOLUTION 8           // 8-bit resolution
#define BAUD_RATE 9600             // UART baud rate
#define HEARTBEAT_INTERVAL 1000    // 1s heartbeat
#define STATS_INTERVAL 2000        // 2s stats update
#define MAX_COMMAND_LENGTH 32      // Max length of received command

// Variables
OneWire oneWire[TEMP_SENSOR_COUNT] = {OneWire(2), OneWire(4), OneWire(5), OneWire(18), OneWire(19)};
DallasTemperature sensors[TEMP_SENSOR_COUNT] = {DallasTemperature(&oneWire[0]), DallasTemperature(&oneWire[1]), 
                                               DallasTemperature(&oneWire[2]), DallasTemperature(&oneWire[3]), 
                                               DallasTemperature(&oneWire[4])};
float tempUser = 25.0, tempMachine = 25.0;
uint8_t blueIntensity = 0, redIntensity = 0;
uint8_t fanUser = 0, fanMachine = 0;
uint32_t sessionTime = 0, totalSessions = 0, totalHours = 0;
float powerUsage = 0.0, weeklyPower = 0.0;
uint32_t weeklySessions = 0;
bool sessionRunning = false, sanitationRunning = false;
volatile bool emergencyStop = false;
uint32_t lastHeartbeat = 0, lastStats = 0;
char hardwareStatus[16] = "Not Detected";
uint32_t sessionStartTime = 0;
bool simulationMode = true; // Default to simulation

// Function Declarations
void handleEmergencyStop();
void handleSerialCommands();
void processCommand(const char* cmd);
void updateSensors();
void updateSession();
void startSession();
void stopSession();
void startSanitation();
void stopSanitation();
void stopAll();
void sendHeartbeat();
void sendStats();
void exportTempCurves();
void exportLightHistory();
void resetStats();

void setup() {
  Serial.begin(BAUD_RATE);
  randomSeed(analogRead(0)); // Seed for simulation

  // Check for hardware presence
  for (int i = 0; i < TEMP_SENSOR_COUNT; i++) {
    sensors[i].begin();
    if (sensors[i].getDeviceCount() > 0) {
      strcpy(hardwareStatus, "Detected");
      simulationMode = false; // Switch to hardware mode if sensors detected
      break;
    }
  }

  if (!simulationMode) {
    // Hardware initialization
    pinMode(ESTOP_PIN, INPUT_PULLUP);
    pinMode(BUZZER_PIN, OUTPUT);
    pinMode(HEARTBEAT_PIN, OUTPUT);
    digitalWrite(BUZZER_PIN, LOW);
    digitalWrite(HEARTBEAT_PIN, LOW);

    for (int i = 0; i < 7; i++) {
      pinMode(RELAY_PINS[i], OUTPUT);
      digitalWrite(RELAY_PINS[i], LOW);
    }

    ledcSetup(0, PWM_FREQ_LIGHT, PWM_RESOLUTION); // Blue light
    ledcSetup(1, PWM_FREQ_LIGHT, PWM_RESOLUTION); // Red light
    ledcSetup(2, PWM_FREQ_FAN, PWM_RESOLUTION);   // User fan
    ledcSetup(3, PWM_FREQ_FAN, PWM_RESOLUTION);   // Machine fan
    ledcAttachPin(BLUE_PWM_PIN, 0);
    ledcAttachPin(RED_PWM_PIN, 1);
    ledcAttachPin(USER_FAN_PIN, 2);
    ledcAttachPin(MACHINE_FAN_PIN, 3);
    ledcWrite(0, 0);
    ledcWrite(1, 0);
    ledcWrite(2, 0);
    ledcWrite(3, 0);

    attachInterrupt(digitalPinToInterrupt(ESTOP_PIN), handleEmergencyStop, FALLING);
  }

  Serial.println("SIMULATION=" + String(simulationMode ? "ON" : "OFF"));
  Serial.flush();
}

void loop() {
  handleSerialCommands();
  updateSensors();
  updateSession();
  sendHeartbeat();
  sendStats();

  if (emergencyStop) {
    stopAll();
    Serial.println("ERROR=EMERGENCY_STOP");
    Serial.flush();
    while (emergencyStop) {
      delay(100);
      if (simulationMode && random(100) < 10) emergencyStop = false; // Simulate reset
    }
  }

  delay(100);
}

void handleEmergencyStop() {
  emergencyStop = true;
  if (!simulationMode) digitalWrite(BUZZER_PIN, HIGH);
  else {
    Serial.println("BUZZER=ON");
    Serial.flush();
  }
}

void handleSerialCommands() {
  static char command[MAX_COMMAND_LENGTH];
  static uint8_t index = 0;

  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      command[index] = '\0';
      processCommand(command);
      index = 0;
    } else if (index < MAX_COMMAND_LENGTH - 1) {
      command[index++] = c;
    }
  }
}

void processCommand(const char* cmd) {
  char key[16], value[16];
  if (sscanf(cmd, "%15[^=]=%15s", key, value) != 2) return;

  if (strcmp(key, "SESSION_TIME") == 0) {
    sessionTime = atof(value) * 60;
    startSession();
  } else if (strcmp(key, "SESSION_STOP") == 0) {
    stopSession();
  } else if (strcmp(key, "SANITATION") == 0) {
    startSanitation();
  } else if (strcmp(key, "SANITATION_STOP") == 0) {
    stopSanitation();
  } else if (strcmp(key, "BLUE_INTENSITY") == 0) {
    blueIntensity = constrain(atoi(value), 0, 100);
    if (!simulationMode) ledcWrite(0, map(blueIntensity, 0, 100, 0, 255));
    else {
      Serial.println("PWM_BLUE=" + String(map(blueIntensity, 0, 100, 0, 255)));
      Serial.flush();
    }
  } else if (strcmp(key, "RED_INTENSITY") == 0) {
    redIntensity = constrain(atoi(value), 0, 100);
    if (!simulationMode) ledcWrite(1, map(redIntensity, 0, 100, 0, 255));
    else {
      Serial.println("PWM_RED=" + String(map(redIntensity, 0, 100, 0, 255)));
      Serial.flush();
    }
  } else if (strcmp(key, "FAN_USER") == 0) {
    fanUser = constrain(atoi(value), 0, 100);
    if (!simulationMode) ledcWrite(2, map(fanUser, 0, 100, 0, 255));
    else {
      Serial.println("PWM_FAN_USER=" + String(map(fanUser, 0, 100, 0, 255)));
      Serial.flush();
    }
  } else if (strcmp(key, "FAN_MACHINE") == 0) {
    fanMachine = constrain(atoi(value), 0, 100);
    if (!simulationMode) ledcWrite(3, map(fanMachine, 0, 100, 0, 255));
    else {
      Serial.println("PWM_FAN_MACHINE=" + String(map(fanMachine, 0, 100, 0, 255)));
      Serial.flush();
    }
  } else if (strcmp(key, "SET_TEMP_USER") == 0) {
    tempUser = atof(value); // Simulate or placeholder for real temp control
  } else if (strcmp(key, "SET_TEMP_MACHINE") == 0) {
    tempMachine = atof(value); // Simulate or placeholder for real temp control
  } else if (strcmp(key, "SHUTDOWN") == 0) {
    stopAll();
  } else if (strcmp(key, "RESET_STATS") == 0) {
    resetStats();
  } else if (strcmp(key, "EXPORT_TEMP_CURVES") == 0) {
    exportTempCurves();
  } else if (strcmp(key, "EXPORT_LIGHT_HISTORY") == 0) {
    exportLightHistory();
  } else if (strcmp(key, "GET_STATS") == 0) {
    sendStats();
  }
}

void updateSensors() {
  static uint32_t lastUpdate = 0;
  if (millis() - lastUpdate < 2000) return;
  lastUpdate = millis();

  if (!simulationMode) {
    float tempSum = 0;
    int validSensors = 0;
    for (int i = 0; i < TEMP_SENSOR_COUNT; i++) {
      sensors[i].requestTemperatures();
      float temp = sensors[i].getTempCByIndex(0);
      if (temp != DEVICE_DISCONNECTED_C) {
        tempSum += temp;
        validSensors++;
      }
    }
    if (validSensors > 0) {
      tempUser = tempMachine = tempSum / validSensors;
    } else {
      Serial.println("ERROR=TEMP_SENSOR_FAIL");
      Serial.flush();
    }

    float current1 = analogRead(ACS758_PIN1) * (5.0 / 4095.0) / 0.04;
    float current2 = analogRead(ACS758_PIN2) * (5.0 / 4095.0) / 0.04;
    float totalCurrent = current1 + current2;
    float voltage = analogRead(ZMPT101B_PIN) * (5.0 / 4095.0) * 100;
    powerUsage += (totalCurrent * voltage) / 3600.0;
    if (sessionRunning || sanitationRunning) weeklyPower += (totalCurrent * voltage) / 3600.0;
  } else {
    tempUser += (random(-10, 11) / 10.0);
    tempMachine += (random(-10, 11) / 10.0);
    tempUser = constrain(tempUser, 20.0, 40.0);
    tempMachine = constrain(tempMachine, 20.0, 40.0);

    float current1 = random(0, 500) / 10.0;
    float current2 = random(0, 500) / 10.0;
    float totalCurrent = current1 + current2;
    float voltage = random(200, 240);
    powerUsage += (totalCurrent * voltage) / 3600.0 / 500.0;
    if (sessionRunning || sanitationRunning) weeklyPower += (totalCurrent * voltage) / 3600.0 / 500.0;
  }
}

void updateSession() {
  if (sessionRunning && (millis() - sessionStartTime) / 1000 >= sessionTime) {
    stopSession();
  }
  if (sanitationRunning && (millis() - sessionStartTime) / 1000 >= 180) {
    stopSanitation();
  }
}

void startSession() {
  if (!sessionRunning && !sanitationRunning) {
    sessionRunning = true;
    sessionStartTime = millis();
    totalSessions++;
    weeklySessions++;
    if (!simulationMode) digitalWrite(RELAY_PINS[0], HIGH);
    else {
      Serial.println("RELAY_1=ON");
      Serial.flush();
    }
  }
}

void stopSession() {
  if (sessionRunning) {
    sessionRunning = false;
    totalHours += (millis() - sessionStartTime) / 3600000.0;
    stopAll();
  }
}

void startSanitation() {
  if (!sessionRunning && !sanitationRunning) {
    sanitationRunning = true;
    sessionStartTime = millis();
    if (!simulationMode) digitalWrite(RELAY_PINS[1], HIGH);
    else {
      Serial.println("RELAY_2=ON");
      Serial.flush();
    }
  }
}

void stopSanitation() {
  if (sanitationRunning) {
    sanitationRunning = false;
    stopAll();
  }
}

void stopAll() {
  blueIntensity = 0;
  redIntensity = 0;
  fanUser = 0;
  fanMachine = 0;
  if (!simulationMode) {
    ledcWrite(0, 0);
    ledcWrite(1, 0);
    ledcWrite(2, 0);
    ledcWrite(3, 0);
    for (int i = 0; i < 7; i++) digitalWrite(RELAY_PINS[i], LOW);
    digitalWrite(BUZZER_PIN, LOW);
  } else {
    Serial.println("PWM_BLUE=0");
    Serial.println("PWM_RED=0");
    Serial.println("PWM_FAN_USER=0");
    Serial.println("PWM_FAN_MACHINE=0");
    Serial.println("RELAY_1=OFF");
    Serial.println("RELAY_2=OFF");
    Serial.println("BUZZER=OFF");
    Serial.flush();
  }
}

void sendHeartbeat() {
  if (millis() - lastHeartbeat >= HEARTBEAT_INTERVAL) {
    if (!simulationMode) digitalWrite(HEARTBEAT_PIN, !digitalRead(HEARTBEAT_PIN));
    else {
      Serial.println("HEARTBEAT=" + String(!digitalRead(HEARTBEAT_PIN)));
      Serial.flush();
    }
    lastHeartbeat = millis();
  }
}

void sendStats() {
  if (millis() - lastStats < STATS_INTERVAL) return;
  lastStats = millis();

  Serial.println("TEMP_USER=" + String(tempUser, 2));
  Serial.println("TEMP_MACHINE=" + String(tempMachine, 2));
  Serial.println("BLUE_INTENSITY=" + String(blueIntensity));
  Serial.println("RED_INTENSITY=" + String(redIntensity));
  Serial.println("FAN_USER=" + String(fanUser));
  Serial.println("FAN_MACHINE=" + String(fanMachine));
  Serial.println("SESSION_TIME=" + String(sessionRunning ? (sessionTime - (millis() - sessionStartTime) / 1000) : sessionTime));
  Serial.println("TOTAL_SESSIONS=" + String(totalSessions));
  Serial.println("TOTAL_HOURS=" + String(totalHours, 2));
  Serial.println("POWER_USAGE=" + String(powerUsage, 2));
  Serial.println("WEEKLY_SESSIONS=" + String(weeklySessions));
  Serial.println("WEEKLY_POWER=" + String(weeklyPower, 2));
  Serial.println("HARDWARE_STATUS=" + String(hardwareStatus));
  Serial.flush(); // Ensure all stats are sent as a complete block
}

void exportTempCurves() {
  Serial.println("TEMP_CURVES_START");
  Serial.println("Timestamp,UserTemp,MachineTemp");
  Serial.println(String(millis()) + "," + String(tempUser, 2) + "," + String(tempMachine, 2));
  Serial.println("TEMP_CURVES_END");
  Serial.flush();
}

void exportLightHistory() {
  Serial.println("LIGHT_HISTORY_START");
  Serial.println("Timestamp,Blue,Red");
  Serial.println(String(millis()) + "," + String(blueIntensity) + "," + String(redIntensity));
  Serial.println("LIGHT_HISTORY_END");
  Serial.flush();
}

void resetStats() {
  totalSessions = 0;
  totalHours = 0;
  powerUsage = 0.0;
  weeklySessions = 0;
  weeklyPower = 0.0;
}