interface ITask {
  name: string // 任务名称
  callback: Function // 任务期望执行的函数
}
class Queue {
  public q: ITask[] = []

  public append(t: ITask) {
    this.q.push(t)
  }
  public async execute() {
    const tasks = [...this.q]
    this.q = []
    console.log(`[Queue] execute ${new Date()}`)
    try {
      await Promise.all(
        tasks.map(
          (task, index) =>
            new Promise(resolve => {
              console.log(`[Queue] ${index}.Task ${task.name} execute.`)
              resolve(task.callback())
            }),
        ),
      )
    } catch (e) {
      console.error(e)
    }
  }
}
export default new Queue()
