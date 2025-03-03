import React from "react";
import FallingText from "../../UI/FallingText";

function adminDashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <FallingText
        text={`Welcome to the Pawgo Admin Dashboard! We are excited to have you on board.`}
        highlightWords={["React", "Bits", "animated", "components", "simplify"]}
        highlightClass="highlighted"
        trigger="hover"
        backgroundColor="transparent"
        wireframes={false}
        gravity={0.56}
        fontSize="2rem"
        mouseConstraintStiffness={0.9}
      />
    </div>
  );
}

export default adminDashboard;