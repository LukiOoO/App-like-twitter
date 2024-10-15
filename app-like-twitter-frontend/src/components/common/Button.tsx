import React, { ReactNode } from "react";
import Image from "next/image";
import { ButtonProps } from "@/types/porps/props";

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
    {imageAlt && imageSrc && imageWidth && imageHeight && (
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={imageWidth}
        height={imageHeight}
      />
    )}
  </button>
);

export default Button;
