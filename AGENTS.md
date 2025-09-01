## AIエージェントへの指示（memorybank連携前提）

- プロジェクト作業に入る前に必ずmemorybank/以下すべての.mdファイルを最新で読むこと。
- タスク管理・進捗・設計方針・履歴・ルールはすべてmemorybank/以下にMarkdownでドキュメント化。
  常にその内容が最優先で、プロジェクト規則・制約もmemorybankで管理。
- 共同作業や複数エージェント利用時も、競合を避けるためmemorybank最新内容を必ず参照して作業すること。
- 変更があったらactive-tasks.mdやprogress.mdも即座にアップデートして残すこと。
- 機能追加や大きな設計変更時はarchitecture.mdやfeature-history.mdにも追記する。
- 迷ったら「projectbrief.md」を読み直してプロジェクト全体の意図を確認。
- memorybank/以下は最低限の構成（projectbrief.md, active-tasks.md）から開始してください。
- プロジェクトの進行・複雑化・新しい課題発生に応じて  必要と判断したファイル（例: architecture.md, progress.md, tech-context.mdなど）はAIエージェント自身が新規作成・命名・構成管理を行ってください。
- 追加されたファイルの更新・反映はプルリクエストを通じて他のエージェントにも共有し、memorybank全体で一貫性を保ってください。
