"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { forwardRef, type HTMLAttributes, type ImgHTMLAttributes, type ReactNode } from "react";

import { cn } from "../../../utils";

const imageFrameVariants = cva(
  ["relative overflow-hidden rounded-md", "bg-muted text-muted-foreground"],
  {
    variants: {
      ratio: {
        auto: "",
        square: "aspect-square",
        video: "aspect-video",
        wide: "aspect-[16/9]",
      },
      fit: {
        cover: "",
        contain: "",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      ratio: "auto",
      fit: "cover",
    },
  },
);

export interface ImageFrameProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof imageFrameVariants> {
  src?: string;
  alt?: string;
  fallback?: ReactNode;

  /**
   * next/image 등 외부 이미지 렌더러를 주입할 때 사용한다.
   *
   * imageSlot이 있으면 primitive는 내부 <img>를 렌더링하지 않고,
   * 프레임 컨테이너 역할만 수행한다.
   */
  imageSlot?: ReactNode;

  imageClassName?: string;
  imageProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "className">;
}

const ImageFrame = forwardRef<HTMLDivElement, ImageFrameProps>(
  (
    {
      className,
      imageClassName,
      ratio,
      fit,
      fullWidth,
      src,
      alt,
      fallback,
      imageSlot,
      imageProps,
      children,
      ...props
    },
    ref,
  ) => {
    const objectFitClassName = fit === "contain" ? "object-contain" : "object-cover";
    const hasImageSlot = imageSlot !== undefined && imageSlot !== null && imageSlot !== false;
    const hasImage = hasImageSlot || Boolean(src);

    return (
      <div
        ref={ref}
        data-ratio={ratio ?? "auto"}
        data-fit={fit ?? "cover"}
        data-full-width={fullWidth ? "true" : "false"}
        data-has-image={hasImage ? "true" : "false"}
        className={cn(imageFrameVariants({ ratio, fit, fullWidth }), className)}
        {...props}
      >
        {hasImageSlot ? (
          imageSlot
        ) : src ? (
          <img
            src={src}
            alt={alt ?? ""}
            className={cn("size-full", objectFitClassName, imageClassName)}
            {...imageProps}
          />
        ) : (
          fallback
        )}

        {children}
      </div>
    );
  },
);

ImageFrame.displayName = "ImageFrame";

export default ImageFrame;
