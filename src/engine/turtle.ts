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
export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

export class Turtle {
  x: number;
  y: number;
  color: Color;
  ctx: CanvasRenderingContext2D;
  penDown: boolean;
  facing: string;
  drawOps: { [key: string]: (arg: number) => void } = {};

  constructor(x: number, y: number, color: Color, ctx: CanvasRenderingContext2D) {
    this.x = x;
    this.y = y;
    this.color = Object.assign({}, color);
    this.ctx = ctx;
    //    this.color = {r: 0,
    //                 g: 250,
    //                 b: 0,
    //                 a: 1.0};
    this.penDown = true;
    this.facing = Turtle.directions[0]; // North
  }
  static directions = [
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

  static drawOpNames = {
    fwd: "moves forward n",
    tcw: "turns clockwise n times",
    tcc: "turns counterclockwise n times",
    tup: "faces turtle up and moves n",
    "cr+": "color red increase by n",
    "cr-": "color red decrease by n",
    "cg+": "color green increase by n",
    "cg-": "color green decrease by n",
    "cb+": "color blue increase by n",
    "cb-": "color blue decrease by n",
    tnt: "tint (brighten) color by n (kinda broken)",
    shd: "shade (darken) color b n (kinda broken)",
    nop: "does nothing",
  };

  static drawOps(t: Turtle) {
    return {
      fwd: (steps: number) => {
        t.moveForward(steps);
      },
      tcw: (amount: number) => {
        t.turn("R", amount);
      },
      tcc: (amount: number) => {
        t.turn("L", amount);
      },
      tup: (steps: number) => {
        t.facing = "N";
        t.moveForward(steps);
      },
      // c[rgb][+-](n): increases/decreases turtle red, green, blue by n.
      "cr+": (amount: number) => {
        t.color["r"] += clamp(amount, 0, 255);
      },
      "cr-": (amount: number) => {
        t.color["r"] -= clamp(amount, 0, 255);
      },
      "cg+": (amount: number) => {
        t.color["g"] += clamp(amount, 0, 255);
      },
      "cg-": (amount: number) => {
        t.color["g"] -= clamp(amount, 0, 255);
      },
      "cb+": (amount: number) => {
        t.color["b"] += clamp(amount, 0, 255);
      },
      "cb-": (amount: number) => {
        t.color["b"] -= clamp(amount, 0, 255);
      },
      tnt: (amount: number) => {
        t.tint(amount);
      },
      shd: (amount: number) => {
        t.shade(amount);
      },
      nop: () => {
        t.nop();
      },
    };
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
    const i = Turtle.directions.findIndex((e) => e === this.facing);
    const l: number = (i - amount) % -Turtle.directions.length;
    const r: number = (i + amount) % Turtle.directions.length;

    if (direction === "L") {
      const f = Turtle.directions.at(l);
      if (typeof f === "string") {
        this.facing = f;
      }
    } else if (direction === "R") {
      const f = Turtle.directions.at(r);
      if (typeof f === "string") {
        this.facing = f;
      }
    }
  }

  shade(amount: number) {
    const { r, g, b } = this.color;
    this.color["r"] = clamp(r * (1 - amount), 0, 255);
    this.color["g"] = clamp(g * (1 - amount), 0, 255);
    this.color["b"] = clamp(b * (1 - amount), 0, 255);
  }

  tint(amount: number) {
    const { r, g, b } = this.color;
    this.color["r"] = clamp(r + (255 - r) * amount, 0, 255);
    this.color["g"] = clamp(g + (255 - g) * amount, 0, 255);
    this.color["b"] = clamp(b + (255 - b) * amount, 0, 255);
  }

  move(direction: string, n: number) {
    const pen = this.penDown;
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
        for (let i = 0; i < n / 2; i++) {
          this.move("NE", 1);
          this.move("N", 1);
        }
        this.facing = "NNE";
        break;

      case "NE":
        for (let i = 0; i < n; i++) {
          this.penDown = false;
          this.move("N", 1);
          this.penDown = pen;
          this.move("E", 1);
        }
        this.facing = "NE";
        break;
      case "ENE":
        for (let i = 0; i < n / 2; i++) {
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
        for (let i = 0; i < n / 2; i++) {
          this.move("SE", 1);
          this.move("E", 1);
        }
        this.facing = "ESE";
        break;

      case "SE":
        for (let i = 0; i < n; i++) {
          this.penDown = false;
          this.move("S", 1);
          this.penDown = pen;
          this.move("E", 1);
        }
        this.facing = "SE";
        break;

      case "SSE":
        for (let i = 0; i < n / 2; i++) {
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
        for (let i = 0; i < n / 2; i++) {
          this.move("SW", 1);
          this.move("S", 1);
        }
        this.facing = "SSW";
        break;

      case "SW":
        for (let i = 0; i < n; i++) {
          this.penDown = false;
          this.move("S", 1);
          this.penDown = pen;
          this.move("W", 1);
        }
        this.facing = "SW";
        break;
      case "WSW":
        for (let i = 0; i < n / 2; i++) {
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
        for (let i = 0; i < n / 2; i++) {
          this.move("NW", 1);
          this.move("W", 1);
        }
        this.facing = "WNW";
        break;

      case "NW":
        for (let i = 0; i < n; i++) {
          this.penDown = false;
          this.move("N", 1);
          this.penDown = pen;
          this.move("W", 1);
        }
        this.facing = "NW";
        break;
      case "NNW":
        for (let i = 0; i < n / 2; i++) {
          this.move("NW", 1);
          this.move("N", 1);
        }
        this.facing = "NNW";
        break;
    }
  }
}

export const opDocs = Object.values(Turtle.drawOpNames);

export const drawOps = Object.keys(Turtle.drawOpNames);
