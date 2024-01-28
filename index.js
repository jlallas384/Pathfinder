class LinkedListNode{
    constructor(data){
        this.data = data
        this.next = null
    }
}

class Queue{
    constructor(list){
        this.head = null;
        this.tail = null;
        for(let elem of list){
            this.push(elem)
        }
    }
    push(data){
        if(this.tail == null)
            this.head = this.tail = new LinkedListNode(data)
        else{
            this.tail.next = new LinkedListNode(data)
            this.tail = this.tail.next
        }

    }
    empty(){
        return this.tail === null
    }
    front(){
        return this.head.data;
    }
    pop(){
        if(this.empty())
            throw "Queue is empty"
        this.head = this.head.next
        if(this.head == null)
            this.tail = null
    }
}

class Position{
    constructor(row, col){
        this.row = row;
        this.col = col;
    }
    equal(other){
        return this.row == other.row && this.col == other.col
    }
}

const N = 11
const directions = [new Position(0, 1), new Position(1, 0), new Position(0, -1), new Position(-1, 0)]

const bfs = (starts, end, bombs) => {
    let queue = new Queue(starts)

    let dist = new Array(N)
    let from = new Array(N)

    for(let row = 0; row < N; row++){
        dist[row] = new Array(N)
        from[row] = new Array(N)
        for(let col = 0; col < N; col++){
            dist[row][col] = -1
        }
    }

    for(let {row, col} of starts){
        dist[row][col] = 0
    }



    let ret = {}
    while(!queue.empty()){
        let cur = queue.front()
        queue.pop()

        if(cur.equal(end)){
            let path = []
            while(!starts.some((e) => {return e.equal(cur)})){
                path.push(cur)
                let pChange = from[cur.row][cur.col]
                cur = new Position(cur.row - pChange.row, cur.col - pChange.col)
            }
            ret.path = path.reverse()
            break
        }

        directions.map((elem) => {
            return new Position(elem.row + cur.row, elem.col + cur.col)
        }).filter((elem) => {
            return 0 <= elem.row && elem.row < N && 0 <= elem.col && elem.col < N && dist[elem.row][elem.col] == -1 && !bombs.some((e) => {return e.equal(elem)})
        }).forEach((elem) => {
            dist[elem.row][elem.col] = dist[cur.row][cur.col] + 1
            from[elem.row][elem.col] = new Position(elem.row - cur.row, elem.col - cur.col)
            queue.push(elem)
        })
    }

    ret.dist = dist
    ret.from = from
    return ret
}


for(let row = 0; row < N; row++){
    let rowBlock = document.createElement('div')
    rowBlock.classList.add('row', 'mb-1')

    for(let col = 0; col < N; col++){
        let colBlock = document.createElement('button')
        colBlock.classList.add('btn', 'border', 'me-1', 'border-3', 'rounded', 'col', 'p-0', 'cell', 'd-flex', 'justify-content-center', 'align-items-center', 'grid-btn', 'bg-gradient')
        colBlock.style.aspectRatio = '1/1'
        rowBlock.appendChild(colBlock)
    }
    document.getElementById("grid").appendChild(rowBlock)
}

const noneState = 0
const startState = 1
const endState = 2
const bombState = 3

let curState = 0



const btns = document.querySelectorAll(".btn-item")

class Handler{
    constructor(btn, state){
        this.state = state
        btn.addEventListener('click', (function(){
            if(curState)
                btns[curState - 1].classList.remove('active-btn-item')

            if(curState == this.state){
                curState = noneState
            }else{
                curState = this.state
            }

            if(curState)
                btns[curState - 1].classList.add('active-btn-item')
               
            btns[this.state - 1].firstChild.nextElementSibling.classList.add('pop') 
        }).bind(this))
    }
}

document.querySelectorAll('.btn-image').forEach((elem) => {
    elem.addEventListener('animationend', function(){
        this.classList.remove("pop")
    })
})

const sfBtn = new Handler(btns[0], startState)
const efBtn = new Handler(btns[1], endState)
const bombBtn = new Handler(btns[2], bombState)


let grid = new Array(N)
const gridBtns = document.querySelectorAll(".grid-btn")

const images = ["images/start_flag.png", "images/end_flag.png", "images/bomb.png", "images/arrow.png"].map((imageName) => {
    let image = document.createElement('img')
    image.src = imageName
    image.style.width = '80%'
    image.style.height = '80%'
    image.classList.add('img-fluid', 'pop')
    return image
})

for(let degs of ["90deg", "180deg", "270deg"]){
    let image = images[3].cloneNode()
    image.style.transform = `rotate(${degs})`
    images.push(image)
}

class GridBtnHandler{
    constructor(e, pos){
        this.e = e
        this.pos = pos
        this.state = noneState
        e.addEventListener('click', () => {
            if(this.state == noneState){
                if(curState){
                    this.state = curState == this ? noneState : curState
                }
            }else{
                this.state = noneState
            }
            this.update()
        })
    }
    update(){
        if(this.e.firstChild)
            this.e.removeChild(this.e.firstChild)
        if(this.state){
            this.e.appendChild(images[this.state - 1].cloneNode())
        }
    }
}

for(let row = 0; row < N; row++){
    grid[row] = new Array(N)
    for(let col = 0; col < N; col++){
        let gridBtn = gridBtns[row * N + col]
        grid[row][col] = new GridBtnHandler(gridBtn, new Position(row, col))
    }
}


const doBfs = async () => {
    let bombs = []
    let starts = []
    let ends = null

    for(let row = 0; row < N; row++){
        for(let col = 0; col < N; col++){
            let pos = new Position(row, col)
            switch(grid[row][col].state){
            case startState:
                starts.push(pos)
                break
            case endState:
                ends = pos
                break
            case bombState:
                bombs.push(pos)
                break
            }
        }
    }

    let ret = bfs(starts, ends, bombs)
    let layers = new Array(N * N)
    for(let layer = 1; layer < N * N; layer++){
        layers[layer] = []
    }
    for(let row = 0; row < N; row++){
        for(let col = 0; col < N; col++){
            if(ret.dist[row][col] >= 1){
                layers[ret.dist[row][col]].push(new Position(row, col))
            }
        }
    }

    const stop = (ms) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, ms)
        })
    }

    await (async () => {
        for(let layer = 1; layer < N * N; layer++){
            for(let {row, col} of layers[layer]){
                for(let [index, elem] of directions.entries()){
                    if(elem.equal(ret.from[row][col])){
                        grid[row][col].state = index + 4
                        grid[row][col].update()
                    }
                }
                if(grid[row][col].pos.equal(ends)){
                    return
                }
            }

            await stop(300)
        }
    })();

    await (async () => {
        for(let layer = 1; layer < N * N; layer++){
            let notOnPath = layers[layer].filter((outer) => {
                return !ret.path.some((inner) => {
                    return inner.equal(outer) && !ends.equal(outer)
                })
            })
            for(let {row, col} of notOnPath){
                grid[row][col].state = noneState
                grid[row][col].update()
            }

            await stop(100)
        }



    })();

    await (async() => {
        grid[ends.row][ends.col].state = endState
        grid[ends.row][ends.col].update()
    })()

}

const reset = () => {
    for(let row = 0; row < N; row++){
        for(let col = 0; col < N; col++){
            grid[row][col].state = noneState
            grid[row][col].update()
        }
    }    
}