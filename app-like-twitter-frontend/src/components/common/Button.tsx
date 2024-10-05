import React, { ReactNode } from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";

interface ButtonProps {
  onClick: () => void;
  buttonClassName: string;
  children: ReactNode;
  imageSrc: string | StaticImageData;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  ariaLabel?: string;
  [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  buttonClassName,
  children,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  ariaLabel,
  ...rest
}) => (
  <button
    className={`${buttonClassName}`}
    onClick={onClick}
    aria-label={ariaLabel}
    {...rest}
  >
    {children && <span className="mr-2">{children}</span>}
    <Image
      src={imageSrc}
      alt={imageAlt}
      width={imageWidth}
      height={imageHeight}
    />
  </button>
);

export default Button;
