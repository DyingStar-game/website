import type { ComponentPropsWithoutRef } from "react";

type LogoSvgProps = ComponentPropsWithoutRef<"svg"> & { size?: number };

export const LogoSvg = ({ size = 32, ...props }: LogoSvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      id="Calque_1"
      x={0}
      y={0}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      {...props}
    >
      <style>
        {
          ".st0{fill:none;stroke:#fbb917;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}"
        }
      </style>
      <path
        d="M41.53 42.2L25.99 26.66m32.89-.33l15.14-15.14C56.29-.49 32.21 1.47 16.6 17.08S-.96 56.76 10.71 74.5l15-15"
        className="st0"
      />
      <path
        fill="#fbb917"
        stroke="#fbb917"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={4}
        d="M88.56 25.73L25.25 89.04c17.74 11.67 41.81 9.7 57.41-5.9s17.57-39.67 5.9-57.41z"
      />
      <path
        d="M95.08 4.65l-33.3 33.31M37.33 62.41L5.36 94.38m44.36-67.42l.01 11.62m-23.1 11.47l11.36-.01"
        className="st0"
      />
      <circle cx={49.58} cy={50.25} r={2.95} fill="#fbb917" />
    </svg>
  );
};
