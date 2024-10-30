import React from "react";
import { ThreeCircles } from "react-loader-spinner";
function Loading() {
  return (
    <div>
      <div className="three_circle_loader">
        <ThreeCircles
          visible={true}
          height={100}
          width={100}
          color="#5e72e4"
          ariaLabel="three-circles-loading"
        />
      </div>
    </div>
  );
}

export default Loading;
