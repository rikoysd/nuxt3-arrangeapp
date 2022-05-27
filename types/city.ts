/**
 * 海外都市に関する部品クラスです.
 */
export class City {
  constructor(
    // id
    private _id: number,
    // 名前
    private _name: string,
    // 候補日程
    private _dateArray: Array<string>
  ) {}

  public get id(): number {
    return this._id;
  }

  public set id(id: number) {
    this._id = id;
  }

  public get name(): string {
    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get dateArray(): Array<string> {
    return this._dateArray;
  }

  public set dateArray(dateArray: Array<string>) {
    this._dateArray = dateArray;
  }
}
