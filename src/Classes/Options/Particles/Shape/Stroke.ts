import {IStroke} from "../../../../Interfaces/Options/Shape/IStroke";

export class Stroke implements IStroke {
    public color: string;
    public width: number;

    constructor() {
        this.color = "#ff0000";
        this.width = 0;
    }
}