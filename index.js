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
        for(let elem in list){
            push(elem)
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

const bfs = (starts, end) => {
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

    dist[start.row][start.col] = 0

    const directions = [new Position(-1, 0), new Position(1, 0), new Position(0, -1), new Position(0, 1)]

    let ret = {}
    while(!queue.empty()){
        let cur = queue.front()
        queue.pop()

        if(cur.equal(end)){
            let path = []
            while(!cur.equal(start)){
                path.push(cur)
                cur = from[cur.row][cur.col]
            }
            ret.path = path.reverse()
            break
        }

        directions.map((elem) => {
            return new Position(elem.row + cur.row, elem.col + cur.col)
        }).filter((elem) => {
            return 0 <= elem.row && elem.row < N && 0 <= elem.col && elem.col < N && dist[elem.row][elem.col] == -1
        }).forEach((elem) => {
            dist[elem.row][elem.col] = dist[cur.row][cur.col] + 1
            from[elem.row][elem.col] = cur
            queue.push(elem)
        })
    }

    ret.dist = dist
    return ret
}


for(let row = 0; row < N; row++){
    let rowBlock = document.createElement('div')
    rowBlock.classList.add('row', 'mb-1')

    for(let col = 0; col < N; col++){
        let colBlock = document.createElement('div')
        colBlock.classList.add('border', 'me-1', 'border-3', 'rounded', 'col', 'p-0', 'cell', 'd-flex', 'justify-content-center', 'align-items-center', 'grid-btn')
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

class Handler{
    constructor(btn, state){
        this.state = state
        btn.addEventListener('click', (function(){
            console.log(this.state)
            if(curState == this.state){
                curState = noneState
            }else{
                curState = this.state
            }
        }).bind(this))
    }
}

const btns = document.querySelectorAll(".zz")


const sfBtn = new Handler(btns[0], startState)
const efBtn = new Handler(btns[1], endState)
const bombBtn = new Handler(btns[2], bombState)

let grid = new Array(N)
const gridBtns = document.querySelectorAll(".grid-btn")

const images = ["images/start_flag.png", "images/end_flag.png", "images/bomb.png"].map((imageName) => {
    let image = document.createElement('img')
    image.src = imageName
    image.style.width = '90%'
    image.style.height = '90%'
    return image
})

let starts = [], ends = null


let gridBtnHandler = function(e){
    if(grid[this.row][this.col] == noneState){
        if(curState){
            console.log(grid[this.row][this.col])
            if(curState == grid[this.row][this.col]){
                console.log(e.target)
                e.target.removeChild(e.target.firstElement)
            }else{
                e.target.appendChild(images[curState - 1].cloneNode())
                grid[this.row][this.col] = curState 
            }
        }
    }
}

for(let row = 0; row < N; row++){
    grid[row] = new Array(N)
    for(let col = 0; col < N; col++){
        grid[row][col] = noneState
        let gridBtn = gridBtns[row * N + col]
        gridBtn.addEventListener('click', gridBtnHandler.bind(new Position(row, col)))
    }
}

