import React, { useState, useRef } from "react";
import CircleControl from "./CircleControll";

const LeftController = () => {
  const [blueLight, setBlueLight] = useState(0);
  const [redLight, setRedLight] = useState(0);
  const [userTemp, setUserTemp] = useState(25);
  const [machineTemp, setMachineTemp] = useState(24);

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="grid grid-cols-2 gap-x-22 gap-y-6">
        {/* Knob-enabled for Blue Light & Red Light */}
        <CircleControl label="Blue Light" color="blue" value={blueLight} setValue={setBlueLight} max={100} unit="%" knobEnabled={true} />
        <CircleControl label="Red Light" color="red" value={redLight} setValue={setRedLight} max={100} unit="%" knobEnabled={true} />

        {/* Buttons for User Temp & Machine Temp */}
        <CircleControl label="User Temp" color="green" value={userTemp} setValue={setUserTemp} max={50} unit="°C" knobEnabled={false} />
        <CircleControl label="Machine Temp" color="orange" value={machineTemp} setValue={setMachineTemp} max={50} unit="°C" knobEnabled={false} />
      </div>
    </div>
  );
};

export default LeftController;
