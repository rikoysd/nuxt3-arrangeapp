/**
 * イベントの部品クラスです.
 */
export class Event {
  constructor(
    // id
    private _id: number,
    // イベント名
    private _eventName: string,
    // イベントの説明
    private _description: string,
    // 日本の日時
    private _date: Array<string>,
    // メールアドレス
    private _email: string,
    // パスワード
    private _password: string,
  ) {}

  public get id(): number {
    return this._id;
  }

  public set id(id: number) {
    this._id = id;
  }
  public get eventName(): string {
    return this._eventName;
  }

  public set eventName(eventName: string) {
    this._eventName = eventName;
  }

  public get description(): string {
    return this._description;
  }

  public set description(description: string) {
    this._description = description;
  }

  public get date(): Array<string> {
    return this._date;
  }

  public set date(date: Array<string>) {
    this._date = date;
  }

  public get email(): string {
    return this._email;
  }

  public set email(email: string) {
    this._email = email;
  }

  public get password(): string {
    return this._password;
  }

  public set password(password: string) {
    this._password = password;
  }
}
