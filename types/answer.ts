/**
 * 回答に関する部品クラスです.
 */
export class Answer {
  constructor(
    // id
    private _id: number,
    // 回答者名前
    private _answerName: string,
    // 回答リスト
    private _answerList: Array<string>,
    // コメント
    private _comment: string
  ) {}

  public get id(): number {
    return this._id;
  }

  public set id(id: number) {
    this._id = id;
  }

  public get answerName(): string {
    return this._answerName;
  }

  public set answerName(answerName: string) {
    this._answerName = answerName;
  }

  public get answerList(): Array<string> {
    return this._answerList;
  }

  public set answerList(answerList: Array<string>) {
    this._answerList = answerList;
  }

  public get comment(): string {
    return this._comment;
  }

  public set comment(comment: string) {
    this._comment = comment;
  }
}
