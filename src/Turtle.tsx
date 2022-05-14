//@ts-nocheck
//import React from 'react'
export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}
export function rgbaStr(color: Color) {
  return `rgba(${color.r},${color.g},${color.b},${color.a})`;
}
export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export class Turtle {
  x: number;
  y: number;
  color: Color;
  ctx: CanvasRenderingContext2D;
  penDown: boolean;
  facing: string;
  directions: Array<string>;

  constructor(
    x: number,
    y: number,
    color: Color,
    ctx: CanvasRenderingContext2D
  ) {
    this.x = x;
    this.y = y;
    this.color = Object.assign({}, color);
    this.ctx = ctx;
    //    this.color = {r: 0,
    //                 g: 250,
    //                 b: 0,
    //                 a: 1.0};
    this.penDown = true;
    this.facing = "N";
    this.directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ]; //clockwise starting at N
  }
  colorstr() {
    return rgbaStr(this.color);
  }
  clickPen() {
    this.penDown = !this.penDown;
  }

  goto(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  nop() {
    return;
  }

  moveForward(n: number) {
    this.move(this.facing, n);
  }

  turn(direction: string, amount: number) {
    let i = this.directions.findIndex((e) => e === this.facing);
    let l: number = (i - amount) % -this.directions.length;
    let r: number = (i + amount) % this.directions.length;

    if (direction === "L") {
      let f = this.directions.at(l);
      if (typeof f === "string") {
        this.facing = f;
      }
    } else if (direction === "R") {
      let f = this.directions.at(r);
      if (typeof f === "string") {
        this.facing = f;
      }
    }
  }

  shade(amount: number) {
    let { r, g, b } = this.color;
    this.color["r"] = clamp(r * (1 - amount), 0, 255);
    this.color["g"] = clamp(g * (1 - amount), 0, 255);
    this.color["b"] = clamp(b * (1 - amount), 0, 255);
  }

  tint(amount: number) {
    let { r, g, b } = this.color;
    this.color["r"] = clamp(r + (255 - r) * amount, 0, 255);
    this.color["g"] = clamp(g + (255 - g) * amount, 0, 255);
    this.color["b"] = clamp(b + (255 - b) * amount, 0, 255);
  }

  move(direction: string, n: number) {
    switch (direction) {
      case "N":
        if (this.penDown) {
          this.ctx.fillStyle = this.colorstr();
          this.ctx.fillRect(this.x, this.y - 1, 1, -n);
        }
        this.facing = "N";
        this.y -= n;
        break;

      case "NNE":
        for (var i = 0; i < n / 2; i++) {
          this.move("NE", 1);
          this.move("N", 1);
        }
        this.facing = "NNE";
        break;

      case "NE":
        var pen = this.penDown;
        for (var i = 0; i < n; i++) {
          this.penDown = false;
          this.move("N", 1);
          this.penDown = pen;
          this.move("E", 1);
        }
        this.facing = "NE";
        break;
      case "ENE":
        for (var i = 0; i < n / 2; i++) {
          this.move("NE", 1);
          this.move("E", 1);
        }
        this.facing = "ENE";
        break;

      case "E":
        if (this.penDown) {
          this.ctx.fillStyle = this.colorstr();
          this.ctx.fillRect(this.x + 1, this.y - 1, n, 1);
        }
        this.facing = "E";
        this.x += n;
        break;

      case "ESE":
        for (var i = 0; i < n / 2; i++) {
          this.move("SE", 1);
          this.move("E", 1);
        }
        this.facing = "ESE";
        break;

      case "SE":
        var pen = this.penDown;
        for (var i = 0; i < n; i++) {
          this.penDown = false;
          this.move("S", 1);
          this.penDown = pen;
          this.move("E", 1);
        }
        this.facing = "SE";
        break;

      case "SSE":
        for (var i = 0; i < n / 2; i++) {
          this.move("SE", 1);
          this.move("S", 1);
        }
        this.facing = "SSE";
        break;
      case "S":
        if (this.penDown) {
          this.ctx.fillStyle = this.colorstr();
          this.ctx.fillRect(this.x, this.y, 1, n);
        }
        this.facing = "S";
        this.y += n;
        break;

      case "SSW":
        for (var i = 0; i < n / 2; i++) {
          this.move("SW", 1);
          this.move("S", 1);
        }
        this.facing = "SSW";
        break;

      case "SW":
        var pen = this.penDown;
        for (var i = 0; i < n; i++) {
          this.penDown = false;
          this.move("S", 1);
          this.penDown = pen;
          this.move("W", 1);
        }
        this.facing = "SW";
        break;
      case "WSW":
        for (var i = 0; i < n / 2; i++) {
          this.move("SW", 1);
          this.move("W", 1);
        }
        this.facing = "WSW";
        break;

      case "W":
        if (this.penDown) {
          this.ctx.fillStyle = this.colorstr();
          this.ctx.fillRect(this.x, this.y - 1, -n, 1);
        }
        this.x -= n;
        this.facing = "W";
        break;
      case "WNW":
        for (var i = 0; i < n / 2; i++) {
          this.move("NW", 1);
          this.move("W", 1);
        }
        this.facing = "WNW";
        break;

      case "NW":
        var pen = this.penDown;
        for (var i = 0; i < n; i++) {
          this.penDown = false;
          this.move("N", 1);
          this.penDown = pen;
          this.move("W", 1);
        }
        this.facing = "NW";
        break;
      case "NNW":
        for (var i = 0; i < n / 2; i++) {
          this.move("NW", 1);
          this.move("N", 1);
        }
        this.facing = "NNW";
        break;
    }
  }
}
