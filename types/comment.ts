/**
 * コメントに関する部品クラスです.
 */
export class Comment {
  constructor(
    // 名前
    private _name: string,
    // コメント
    private _comment: string
  ) {}

  public get name(): string {
    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get comment(): string {
    return this._comment;
  }

  public set comment(comment: string) {
    this._comment = comment;
  }
}
