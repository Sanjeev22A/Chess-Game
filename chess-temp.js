const gameboard=document.querySelector("#gameboard")
const blackCollection=document.querySelector("#black_pieces_collection")
const whiteCollection=document.querySelector("#white_pieces_collection")
const player_display=document.querySelector('#player');
const info_display=document.querySelector('#info-display');
let player="white"
let p="piece_white"
player_display.textContent=player
const chessPieces={
    'king':king,
    'queen':queen,
    'bishop':bishop,
    'rook':rook,
    'pawn':pawn,
    'knight':knight,
}
const startpieces=[
    rook,knight,bishop,queen,king,bishop,knight,rook,
    pawn,pawn,pawn,pawn,pawn,pawn,pawn,pawn,
    "","","","","","","","",
    "","","","","","","","",
    "","","","","","","","",
    "","","","","","","","",
    pawn,pawn,pawn,pawn,pawn,pawn,pawn,pawn,
    rook,knight,bishop,queen,king,bishop,knight,rook
]

function createBoard(){
    startpieces.forEach((startpiece,i)=>{
        const square=document.createElement('div')
        square.setAttribute('square-id',i)
        square.innerHTML=startpiece
        if(square.firstChild){
            square.firstChild.setAttribute('draggable',true);
        }
        const row=Math.ceil(63-i/8)
        square.classList.add('square')
        if(row%2===0){
            square.classList.add(i%2===0? 'brown':'white')
        }
        else{
            square.classList.add(i%2===0? 'white':'brown')         
        }
        
        gameboard.append(square)
        if(i<=15){
           square.firstChild.setAttribute('Color','piece_black');
            square.firstChild.firstChild.classList.add("piece_black");
        }
        if(i>=48){
            square.firstChild.firstChild.classList.add("piece_white");
            square.firstChild.setAttribute('Color','piece_white');
        }
        
        
    })
    for(let i=0;i<16;i++){
    const block=document.createElement('div');
    const block2=document.createElement('div');
    block.setAttribute('block-id',i);
    block2.setAttribute('block-id',i+16)
    block2.classList.add('block')
    block.classList.add('block');
    console.log(block)
    blackCollection.append(block)
    whiteCollection.append(block2)
    }
}
createBoard()

let i=0,j=0;

const allSquare=document.querySelectorAll("#gameboard .square");

for(let x of allSquare){
    x.addEventListener('dragstart',dragStart);
    x.addEventListener('dragover',dragover);
    x.addEventListener('drop',dragDrop);    ///function name is the second parameter. they are called with the current element the element being accessed
}
let startPosition=null,elem=null


///This function will be called when drag strats
function dragStart(e){
    console.log(e.target.getAttribute('Color'));
    startPosition=e.target.parentNode.getAttribute('square-id');
    elem=e.target
    console.log(elem)


}

////This function is called during dragover
 function dragover(e){
    e.preventDefault();

 }
 ////This function occurs during drag drop

 function dragDrop(e){
    e.stopPropagation();  ///used to prevent function from being called unnecessarily
    
    //console.log('hi')
    
    const taken=e.target.classList.contains('pieces');    ///checks if the target we are dropping contains a piece
    
    const correct_move=elem.firstChild.classList.contains(p);       ///checks if the correct player is making their move
    
    const opponentGo= player==='white'?'piece_black':'piece_white';     ///cheks opponents go whether the player is taking his opponents piece
    
    const takenByopponent=e.target.firstChild?.classList.contains(opponentGo);      ///is true is correct piece take
    ///console.log(e.target)
    const valid=checkIfMoveIsValid(e);
    console.log('valid',valid)
   
    if(correct_move){
        //check this first
        if(takenByopponent && valid){   
            pushToSide(e);       
              ///to take the opponents peice if the move is valid
            e.target.parentNode.append(elem)
            console.log(e.target)
            e.target.remove() 
            
            checkForWin()
            changePlayer()
            
            return ;

        }
        if(taken && !takenByopponent){                    ///to prevent white from taking white pieces or viceversa
            info_display.textContent="illegal move"
            setTimeout(() => info_display.textContent="",2000)
            return;
        }
        if(valid){      ///to move to an empty square
       
            /// e.target.remove
             e.target.append(elem)
             checkForWin()
             changePlayer();
             return true;
        
     }
    
 }
}
function pushToSide(e){
    console.log(e.target);
    if(e.target.getAttribute('color')=="piece_white"){
        let writer=document.getElementById('black_pieces_collection');
        console.log(writer);
        let x=writer.children;
        console.log(e.target.firstChild);
        x[i++].append(e.target.firstChild);

    }
    else{
        let writer=document.getElementById('white_pieces_collection');
        console.log(writer);
        let x=writer.children;
        e.target.setAttribute('draggable','false');
        console.log(e.target.firstChild);
        x[j++].append(e.target.firstChild);
    }
}
 
////Indicates player's turn
 function changePlayer(){
    if(player=='white'){
        console.log('hi')
        reverseId()
        player='black';
        p="piece_black"
        player_display.textContent=player
    }
    else{
        revertId()
        player='white';
        p="piece_white";
        player_display.textContent=player
    }
 }

 ///reverses board after turn

 function reverseId(){
    let allSquare=document.querySelectorAll(".square");
    let i=0;
    for(let x of allSquare){
          x.setAttribute('square-id',63-i)
          i++
    }
 }
 function revertId(){
    let allSquare=document.querySelectorAll(".square");
    let i=0;
    for(let x of allSquare){
          x.setAttribute('square-id',i++)
    }
 }


///Checks if move is valid

function checkIfMoveIsValid(e){
    console.log('function',e.target)
    let target_id=e.target.getAttribute('square-id') || e.target.parentNode.getAttribute('square-id') ;  ///if pieces exist then first option else second
    target_id=Number(target_id);
    const start_id=Number(elem.parentNode.getAttribute('square-id'));
    let piece=elem.id;

    ////checks for king's move
    if(piece=="king"){
        if(start_id==target_id+1 || start_id==target_id-1 || start_id==target_id+8 || start_id==target_id-8 || start_id==target_id+7 || start_id==9+target_id ||start_id==target_id-7 || start_id==target_id-9 ){
            return true;
        }
        else{
            return false;
        }
    }
    //////Function to validate a pawn's move
    if(piece=="pawn"){
        let start_array=[48,49,50,51,52,53,54,55];
        let end_array=[0,1,2,3,4,5,6,7];
         if(start_array.includes(start_id)){
        console.log(target_id,start_id)
          if((target_id===start_id-8 && !document.querySelector(`[square-id="${start_id-8}"]`).firstChild)  || ( target_id===start_id-16 && !document.querySelector(`[square-id="${start_id-16}"]`).firstChild)){
            return true;
          }  
    }
    if(target_id===start_id-8 && !document.querySelector(`[square-id="${start_id-8}"]`).firstChild){
        if(end_array.includes(target_id)){
            console.log(elem);
            elem.id="queen";
            elem.innerHTML=queen;
            console.log(elem.getAttribute('color'))
            if(elem.getAttribute('color')=="piece_white"){
            elem.firstChild.classList.add("piece_white");
            }
        }
        else{
            elem.firstChild.classList.add("piece_black");
        }
        //console.log('coreect hi')
        return true;
    }
        if(( start_id-7===target_id  && document.querySelector(`[square-id="${start_id-7}"]`).firstChild) || ( start_id-9===target_id  && document.querySelector(`[square-id="${start_id-9}"]`).firstChild)){
            console.log(e.target.getAttribute('square-id'))
            if(end_array.includes(target_id)){
                console.log(elem);
                elem.id="queen";
                elem.innerHTML=queen;
                console.log(elem.getAttribute('color'))
                if(elem.getAttribute('color')=="piece_white"){
                elem.firstChild.classList.add("piece_white");
                }
            }
            else{
                elem.firstChild.classList.add("piece_black");
            }
            console.log('hi2')
        return true;

        ////from here get the cut peice
        }

            return false;
    }


    ///function for bisphop's moves
     if(piece=="bishop"){

        if(  (start_id==target_id+7 || start_id==9+target_id) || (start_id==target_id+14 && !document.querySelector(`[square-id="${start_id-7}"]`).firstChild) ||
        (start_id==target_id+21 && !document.querySelector(`[square-id="${start_id-7}"]`).firstChild && !document.querySelector(`[square-id="${start_id-14}"]`).firstChild) ||
        (start_id==target_id+28 && !document.querySelector(`[square-id="${start_id-7}"]`).firstChild && !document.querySelector(`[square-id="${start_id-14}"]`).firstChild && !document.querySelector(`[square-id="${start_id-21}"]`).firstChild) || 
        (start_id==target_id+35 && !document.querySelector(`[square-id="${start_id-7}"]`).firstChild && !document.querySelector(`[square-id="${start_id-14}"]`).firstChild && !document.querySelector(`[square-id="${start_id-21}"]`).firstChild && !document.querySelector(`[square-id="${start_id-28}"]`).firstChild) || 
        (start_id==target_id+42 && !document.querySelector(`[square-id="${start_id-7}"]`).firstChild && !document.querySelector(`[square-id="${start_id-14}"]`).firstChild && !document.querySelector(`[square-id="${start_id-21}"]`).firstChild && !document.querySelector(`[square-id="${start_id-28}"]`).firstChild && !document.querySelector(`[square-id="${start_id-35}"]`).firstChild) ||
        (start_id==target_id+49 && !document.querySelector(`[square-id="${start_id-7}"]`).firstChild && !document.querySelector(`[square-id="${start_id-14}"]`).firstChild && !document.querySelector(`[square-id="${start_id-21}"]`).firstChild && !document.querySelector(`[square-id="${start_id-28}"]`).firstChild && !document.querySelector(`[square-id="${start_id-35}"]`).firstChild && !document.querySelector(`[square-id="${start_id-42}"]`).firstChild)
        ) {
            console.log(!document.querySelector(`[square-id="${start_id-7}"]`).firstChild)
        return true;
        }
        if(  (start_id==target_id+7 || start_id==target_id+9) || (start_id==target_id+18 && !document.querySelector(`[square-id="${start_id-9}"]`).firstChild) ||
        (start_id==target_id+27 && !document.querySelector(`[square-id="${start_id-9}"]`).firstChild && !document.querySelector(`[square-id="${start_id-18}"]`).firstChild) ||
        (start_id==target_id+36 && !document.querySelector(`[square-id="${start_id-9}"]`).firstChild && !document.querySelector(`[square-id="${start_id-18}"]`).firstChild && !document.querySelector(`[square-id="${start_id-27}"]`).firstChild) || 
        (start_id==target_id+45 && !document.querySelector(`[square-id="${start_id-9}"]`).firstChild && !document.querySelector(`[square-id="${start_id-18}"]`).firstChild && !document.querySelector(`[square-id="${start_id-27}"]`).firstChild && !document.querySelector(`[square-id="${start_id-36}"]`).firstChild) || 
        (start_id==target_id+54 && !document.querySelector(`[square-id="${start_id-9}"]`).firstChild && !document.querySelector(`[square-id="${start_id-18}"]`).firstChild && !document.querySelector(`[square-id="${start_id-27}"]`).firstChild && !document.querySelector(`[square-id="${start_id-36}"]`).firstChild && !document.querySelector(`[square-id="${start_id-45}"]`).firstChild) ||
        (start_id==target_id+63 && !document.querySelector(`[square-id="${start_id-9}"]`).firstChild && !document.querySelector(`[square-id="${start_id-18}"]`).firstChild && !document.querySelector(`[square-id="${start_id-27}"]`).firstChild && !document.querySelector(`[square-id="${start_id-36}"]`).firstChild && !document.querySelector(`[square-id="${start_id-45}"]`).firstChild && !document.querySelector(`[square-id="${start_id-54}"]`).firstChild)
        ) {
        return true;
        }
        ///backward move
        if(  (start_id==target_id-7 || start_id==target_id-9 )|| (start_id==target_id-14 && !document.querySelector(`[square-id="${start_id+7}"]`).firstChild) ||
        (start_id==target_id-21 && !document.querySelector(`[square-id="${start_id+7}"]`).firstChild && !document.querySelector(`[square-id="${start_id+14}"]`).firstChild) ||
        (start_id==target_id-28 && !document.querySelector(`[square-id="${start_id+7}"]`).firstChild && !document.querySelector(`[square-id="${start_id+14}"]`).firstChild && !document.querySelector(`[square-id="${start_id+21}"]`).firstChild) || 
        (start_id==target_id-35 && !document.querySelector(`[square-id="${start_id+7}"]`).firstChild && !document.querySelector(`[square-id="${start_id+14}"]`).firstChild && !document.querySelector(`[square-id="${start_id+21}"]`).firstChild && !document.querySelector(`[square-id="${start_id+28}"]`).firstChild) || 
        (start_id==target_id-42 && !document.querySelector(`[square-id="${start_id+7}"]`).firstChild && !document.querySelector(`[square-id="${start_id+14}"]`).firstChild && !document.querySelector(`[square-id="${start_id+21}"]`).firstChild && !document.querySelector(`[square-id="${start_id+28}"]`).firstChild && !document.querySelector(`[square-id="${start_id+35}"]`).firstChild) ||
        (start_id==target_id-49 && !document.querySelector(`[square-id="${start_id+7}"]`).firstChild && !document.querySelector(`[square-id="${start_id+14}"]`).firstChild && !document.querySelector(`[square-id="${start_id+21}"]`).firstChild && !document.querySelector(`[square-id="${start_id+28}"]`).firstChild && !document.querySelector(`[square-id="${start_id+35}"]`).firstChild && !document.querySelector(`[square-id="${start_id+42}"]`).firstChild)
        ) {
            //console.log(!document.querySelector(`[square-id="${start_id-7}"]`).firstChild)
        return true;
        }
        if(  (start_id==target_id-7 || start_id==target_id-9) || (start_id==target_id-18 && !document.querySelector(`[square-id="${start_id+9}"]`).firstChild) ||
        (start_id==target_id-27 && !document.querySelector(`[square-id="${start_id+9}"]`).firstChild && !document.querySelector(`[square-id="${start_id+18}"]`).firstChild) ||
        (start_id==target_id-36 && !document.querySelector(`[square-id="${start_id+9}"]`).firstChild && !document.querySelector(`[square-id="${start_id+18}"]`).firstChild && !document.querySelector(`[square-id="${start_id+27}"]`).firstChild) || 
        (start_id==target_id-45 && !document.querySelector(`[square-id="${start_id+9}"]`).firstChild && !document.querySelector(`[square-id="${start_id+18}"]`).firstChild && !document.querySelector(`[square-id="${start_id+27}"]`).firstChild && !document.querySelector(`[square-id="${start_id+36}"]`).firstChild) || 
        (start_id==target_id-54 && !document.querySelector(`[square-id="${start_id+9}"]`).firstChild && !document.querySelector(`[square-id="${start_id+18}"]`).firstChild && !document.querySelector(`[square-id="${start_id+27}"]`).firstChild && !document.querySelector(`[square-id="${start_id+36}"]`).firstChild && !document.querySelector(`[square-id="${start_id+45}"]`).firstChild) ||
        (start_id==target_id-63 && !document.querySelector(`[square-id="${start_id+9}"]`).firstChild && !document.querySelector(`[square-id="${start_id+18}"]`).firstChild && !document.querySelector(`[square-id="${start_id+27}"]`).firstChild && !document.querySelector(`[square-id="${start_id+36}"]`).firstChild && !document.querySelector(`[square-id="${start_id+45}"]`).firstChild && !document.querySelector(`[square-id="${start_id+54}"]`).firstChild)
        ){
        return true;
        }
            return false;
     }

     ///defines knight's moves

     if(piece=="knight"){
        if(start_id==target_id+17  || start_id==target_id+15 || start_id==target_id-17 ||  start_id==target_id-15  || start_id==target_id+6  || start_id==target_id-6 || start_id==target_id+10 || start_id==target_id-10)  {
            return true;
        }
        else{
            return false;
        }
     }

     ///defines rooks moves
     if(piece=="rook"){
        if((start_id==target_id+1) || (start_id==target_id+2 && !document.querySelector(`[square-id="${start_id-1}"]`).firstChild) ||
        (start_id==target_id+3 && !document.querySelector(`[square-id="${start_id-1}"]`).firstChild && !document.querySelector(`[square-id="${start_id-2}"]`).firstChild) ||
        (start_id==target_id+4 && !document.querySelector(`[square-id="${start_id-1}"]`).firstChild && !document.querySelector(`[square-id="${start_id-2}"]`).firstChild && !document.querySelector(`[square-id="${start_id-3}"]`).firstChild) ||
        (start_id==target_id+5 && !document.querySelector(`[square-id="${start_id-1}"]`).firstChild && !document.querySelector(`[square-id="${start_id-2}"]`).firstChild && !document.querySelector(`[square-id="${start_id-3}"]`).firstChild && !document.querySelector(`[square-id="${start_id-4}"]`).firstChild) ||
        (start_id==target_id+6 && !document.querySelector(`[square-id="${start_id-1}"]`).firstChild && !document.querySelector(`[square-id="${start_id-2}"]`).firstChild && !document.querySelector(`[square-id="${start_id-3}"]`).firstChild && !document.querySelector(`[square-id="${start_id-4}"]`).firstChild && !document.querySelector(`[square-id="${start_id-5}"]`).firstChild) ||
        (start_id==target_id+7 && !document.querySelector(`[square-id="${start_id-1}"]`).firstChild && !document.querySelector(`[square-id="${start_id-2}"]`).firstChild && !document.querySelector(`[square-id="${start_id-3}"]`).firstChild && !document.querySelector(`[square-id="${start_id-4}"]`).firstChild && !document.querySelector(`[square-id="${start_id-5}"]`).firstChild && !document.querySelector(`[square-id="${start_id-6}"]`).firstChild) ||
        (start_id==target_id+8 && !document.querySelector(`[square-id="${start_id-1}"]`).firstChild && !document.querySelector(`[square-id="${start_id-2}"]`).firstChild && !document.querySelector(`[square-id="${start_id-3}"]`).firstChild && !document.querySelector(`[square-id="${start_id-4}"]`).firstChild && !document.querySelector(`[square-id="${start_id-5}"]`).firstChild && !document.querySelector(`[square-id="${start_id-6}"]`).firstChild && !document.querySelector(`[square-id="${start_id-7}"]`).firstChild)
        ){
        return true;
        }

        if (
            (start_id == target_id - 1) ||
            (start_id == target_id - 2 && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild) ||
            (start_id == target_id - 3 && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild) ||
            (start_id == target_id - 4 && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild) ||
            (start_id == target_id - 5 && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 4}"]`).firstChild) ||
            (start_id == target_id - 6 && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 5}"]`).firstChild) ||
            (start_id == target_id - 7 && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 6}"]`).firstChild) ||
            (start_id == target_id - 8 && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 6}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 7}"]`).firstChild)
          ) {
            return true;
          }
          if (
            (start_id == target_id - 8) ||
            (start_id == target_id - 16 && !document.querySelector(`[square-id="${start_id + 8}"]`).firstChild) ||
            (start_id == target_id - 24 && !document.querySelector(`[square-id="${start_id + 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 16}"]`).firstChild) ||
            (start_id == target_id - 32 && !document.querySelector(`[square-id="${start_id + 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 24}"]`).firstChild) ||
            (start_id == target_id - 40 && !document.querySelector(`[square-id="${start_id + 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 24}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 32}"]`).firstChild) ||
            (start_id == target_id - 48 && !document.querySelector(`[square-id="${start_id + 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 24}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 32}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 40}"]`).firstChild) ||
            (start_id == target_id - 56 && !document.querySelector(`[square-id="${start_id + 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 24}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 32}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 40}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 48}"]`).firstChild) ||
            (start_id == target_id - 64 && !document.querySelector(`[square-id="${start_id + 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 24}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 32}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 40}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 48}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 56}"]`).firstChild)
          ) {
            return true;
          }
          if (
            (start_id == target_id + 8) ||
            (start_id == target_id + 16 && !document.querySelector(`[square-id="${start_id - 8}"]`).firstChild) ||
            (start_id == target_id + 24 && !document.querySelector(`[square-id="${start_id - 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 16}"]`).firstChild) ||
            (start_id == target_id + 32 && !document.querySelector(`[square-id="${start_id - 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 24}"]`).firstChild) ||
            (start_id == target_id + 40 && !document.querySelector(`[square-id="${start_id - 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 24}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 32}"]`).firstChild) ||
            (start_id == target_id + 48 && !document.querySelector(`[square-id="${start_id - 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 24}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 32}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 40}"]`).firstChild) ||
            (start_id == target_id + 56 && !document.querySelector(`[square-id="${start_id - 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 24}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 32}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 40}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 48}"]`).firstChild) ||
            (start_id == target_id + 64 && !document.querySelector(`[square-id="${start_id - 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 24}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 32}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 40}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 48}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 56}"]`).firstChild)
          ) {
            return true;
          }
        return false;
          


     }
    ///defines queens moves

    if(piece =="queen"){
        ///rook style move
        console.log('hi')


        if((start_id==target_id+1) || (start_id==target_id+2 && !document.querySelector(`[square-id="${start_id-1}"]`).firstChild) ||
        (start_id==target_id+3 && !document.querySelector(`[square-id="${start_id-1}"]`).firstChild && !document.querySelector(`[square-id="${start_id-2}"]`).firstChild) ||
        (start_id==target_id+4 && !document.querySelector(`[square-id="${start_id-1}"]`).firstChild && !document.querySelector(`[square-id="${start_id-2}"]`).firstChild && !document.querySelector(`[square-id="${start_id-3}"]`).firstChild) ||
        (start_id==target_id+5 && !document.querySelector(`[square-id="${start_id-1}"]`).firstChild && !document.querySelector(`[square-id="${start_id-2}"]`).firstChild && !document.querySelector(`[square-id="${start_id-3}"]`).firstChild && !document.querySelector(`[square-id="${start_id-4}"]`).firstChild) ||
        (start_id==target_id+6 && !document.querySelector(`[square-id="${start_id-1}"]`).firstChild && !document.querySelector(`[square-id="${start_id-2}"]`).firstChild && !document.querySelector(`[square-id="${start_id-3}"]`).firstChild && !document.querySelector(`[square-id="${start_id-4}"]`).firstChild && !document.querySelector(`[square-id="${start_id-5}"]`).firstChild) ||
        (start_id==target_id+7 && !document.querySelector(`[square-id="${start_id-1}"]`).firstChild && !document.querySelector(`[square-id="${start_id-2}"]`).firstChild && !document.querySelector(`[square-id="${start_id-3}"]`).firstChild && !document.querySelector(`[square-id="${start_id-4}"]`).firstChild && !document.querySelector(`[square-id="${start_id-5}"]`).firstChild && !document.querySelector(`[square-id="${start_id-6}"]`).firstChild) ||
        (start_id==target_id+8 && !document.querySelector(`[square-id="${start_id-1}"]`).firstChild && !document.querySelector(`[square-id="${start_id-2}"]`).firstChild && !document.querySelector(`[square-id="${start_id-3}"]`).firstChild && !document.querySelector(`[square-id="${start_id-4}"]`).firstChild && !document.querySelector(`[square-id="${start_id-5}"]`).firstChild && !document.querySelector(`[square-id="${start_id-6}"]`).firstChild && !document.querySelector(`[square-id="${start_id-7}"]`).firstChild)
        ){
        return true;
        }

        if (
            (start_id == target_id - 1) ||
            (start_id == target_id - 2 && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild) ||
            (start_id == target_id - 3 && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild) ||
            (start_id == target_id - 4 && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild) ||
            (start_id == target_id - 5 && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 4}"]`).firstChild) ||
            (start_id == target_id - 6 && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 5}"]`).firstChild) ||
            (start_id == target_id - 7 && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 6}"]`).firstChild) ||
            (start_id == target_id - 8 && !document.querySelector(`[square-id="${start_id + 1}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 2}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 3}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 4}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 5}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 6}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 7}"]`).firstChild)
          ) {
            return true;
          }
          if (
            (start_id == target_id - 8) ||
            (start_id == target_id - 16 && !document.querySelector(`[square-id="${start_id + 8}"]`).firstChild) ||
            (start_id == target_id - 24 && !document.querySelector(`[square-id="${start_id + 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 16}"]`).firstChild) ||
            (start_id == target_id - 32 && !document.querySelector(`[square-id="${start_id + 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 24}"]`).firstChild) ||
            (start_id == target_id - 40 && !document.querySelector(`[square-id="${start_id + 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 24}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 32}"]`).firstChild) ||
            (start_id == target_id - 48 && !document.querySelector(`[square-id="${start_id + 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 24}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 32}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 40}"]`).firstChild) ||
            (start_id == target_id - 56 && !document.querySelector(`[square-id="${start_id + 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 24}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 32}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 40}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 48}"]`).firstChild) ||
            (start_id == target_id - 64 && !document.querySelector(`[square-id="${start_id + 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 24}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 32}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 40}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 48}"]`).firstChild && !document.querySelector(`[square-id="${start_id + 56}"]`).firstChild)
          ) {
            return true;
          }
          if (
            (start_id == target_id + 8) ||
            (start_id == target_id + 16 && !document.querySelector(`[square-id="${start_id - 8}"]`).firstChild) ||
            (start_id == target_id + 24 && !document.querySelector(`[square-id="${start_id - 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 16}"]`).firstChild) ||
            (start_id == target_id + 32 && !document.querySelector(`[square-id="${start_id - 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 24}"]`).firstChild) ||
            (start_id == target_id + 40 && !document.querySelector(`[square-id="${start_id - 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 24}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 32}"]`).firstChild) ||
            (start_id == target_id + 48 && !document.querySelector(`[square-id="${start_id - 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 24}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 32}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 40}"]`).firstChild) ||
            (start_id == target_id + 56 && !document.querySelector(`[square-id="${start_id - 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 24}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 32}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 40}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 48}"]`).firstChild) ||
            (start_id == target_id + 64 && !document.querySelector(`[square-id="${start_id - 8}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 16}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 24}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 32}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 40}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 48}"]`).firstChild && !document.querySelector(`[square-id="${start_id - 56}"]`).firstChild)
          ) {
            return true;
          }
          console.log("hi")
          ///bishop style move


          if(  (start_id==target_id+7 || start_id==9+target_id) || (start_id==target_id+14 && !document.querySelector(`[square-id="${start_id-7}"]`).firstChild) ||
          (start_id==target_id+21 && !document.querySelector(`[square-id="${start_id-7}"]`).firstChild && !document.querySelector(`[square-id="${start_id-14}"]`).firstChild) ||
          (start_id==target_id+28 && !document.querySelector(`[square-id="${start_id-7}"]`).firstChild && !document.querySelector(`[square-id="${start_id-14}"]`).firstChild && !document.querySelector(`[square-id="${start_id-21}"]`).firstChild) || 
          (start_id==target_id+35 && !document.querySelector(`[square-id="${start_id-7}"]`).firstChild && !document.querySelector(`[square-id="${start_id-14}"]`).firstChild && !document.querySelector(`[square-id="${start_id-21}"]`).firstChild && !document.querySelector(`[square-id="${start_id-28}"]`).firstChild) || 
          (start_id==target_id+42 && !document.querySelector(`[square-id="${start_id-7}"]`).firstChild && !document.querySelector(`[square-id="${start_id-14}"]`).firstChild && !document.querySelector(`[square-id="${start_id-21}"]`).firstChild && !document.querySelector(`[square-id="${start_id-28}"]`).firstChild && !document.querySelector(`[square-id="${start_id-35}"]`).firstChild) ||
          (start_id==target_id+49 && !document.querySelector(`[square-id="${start_id-7}"]`).firstChild && !document.querySelector(`[square-id="${start_id-14}"]`).firstChild && !document.querySelector(`[square-id="${start_id-21}"]`).firstChild && !document.querySelector(`[square-id="${start_id-28}"]`).firstChild && !document.querySelector(`[square-id="${start_id-35}"]`).firstChild && !document.querySelector(`[square-id="${start_id-42}"]`).firstChild)
          ) {
              console.log(!document.querySelector(`[square-id="${start_id-7}"]`).firstChild)
          return true;
          }
          if(  (start_id==target_id+7 || start_id==target_id+9) || (start_id==target_id+18 && !document.querySelector(`[square-id="${start_id-9}"]`).firstChild) ||
          (start_id==target_id+27 && !document.querySelector(`[square-id="${start_id-9}"]`).firstChild && !document.querySelector(`[square-id="${start_id-18}"]`).firstChild) ||
          (start_id==target_id+36 && !document.querySelector(`[square-id="${start_id-9}"]`).firstChild && !document.querySelector(`[square-id="${start_id-18}"]`).firstChild && !document.querySelector(`[square-id="${start_id-27}"]`).firstChild) || 
          (start_id==target_id+45 && !document.querySelector(`[square-id="${start_id-9}"]`).firstChild && !document.querySelector(`[square-id="${start_id-18}"]`).firstChild && !document.querySelector(`[square-id="${start_id-27}"]`).firstChild && !document.querySelector(`[square-id="${start_id-36}"]`).firstChild) || 
          (start_id==target_id+54 && !document.querySelector(`[square-id="${start_id-9}"]`).firstChild && !document.querySelector(`[square-id="${start_id-18}"]`).firstChild && !document.querySelector(`[square-id="${start_id-27}"]`).firstChild && !document.querySelector(`[square-id="${start_id-36}"]`).firstChild && !document.querySelector(`[square-id="${start_id-45}"]`).firstChild) ||
          (start_id==target_id+63 && !document.querySelector(`[square-id="${start_id-9}"]`).firstChild && !document.querySelector(`[square-id="${start_id-18}"]`).firstChild && !document.querySelector(`[square-id="${start_id-27}"]`).firstChild && !document.querySelector(`[square-id="${start_id-36}"]`).firstChild && !document.querySelector(`[square-id="${start_id-45}"]`).firstChild && !document.querySelector(`[square-id="${start_id-54}"]`).firstChild)
          ) {
          return true;
          }
          ///backward move
          if(  (start_id==target_id-7 || start_id==target_id-9 )|| (start_id==target_id-14 && !document.querySelector(`[square-id="${start_id+7}"]`).firstChild) ||
          (start_id==target_id-21 && !document.querySelector(`[square-id="${start_id+7}"]`).firstChild && !document.querySelector(`[square-id="${start_id+14}"]`).firstChild) ||
          (start_id==target_id-28 && !document.querySelector(`[square-id="${start_id+7}"]`).firstChild && !document.querySelector(`[square-id="${start_id+14}"]`).firstChild && !document.querySelector(`[square-id="${start_id+21}"]`).firstChild) || 
          (start_id==target_id-35 && !document.querySelector(`[square-id="${start_id+7}"]`).firstChild && !document.querySelector(`[square-id="${start_id+14}"]`).firstChild && !document.querySelector(`[square-id="${start_id+21}"]`).firstChild && !document.querySelector(`[square-id="${start_id+28}"]`).firstChild) || 
          (start_id==target_id-42 && !document.querySelector(`[square-id="${start_id+7}"]`).firstChild && !document.querySelector(`[square-id="${start_id+14}"]`).firstChild && !document.querySelector(`[square-id="${start_id+21}"]`).firstChild && !document.querySelector(`[square-id="${start_id+28}"]`).firstChild && !document.querySelector(`[square-id="${start_id+35}"]`).firstChild) ||
          (start_id==target_id-49 && !document.querySelector(`[square-id="${start_id+7}"]`).firstChild && !document.querySelector(`[square-id="${start_id+14}"]`).firstChild && !document.querySelector(`[square-id="${start_id+21}"]`).firstChild && !document.querySelector(`[square-id="${start_id+28}"]`).firstChild && !document.querySelector(`[square-id="${start_id+35}"]`).firstChild && !document.querySelector(`[square-id="${start_id+42}"]`).firstChild)
          ) {
              //console.log(!document.querySelector(`[square-id="${start_id-7}"]`).firstChild)
          return true;
          }
          if(  (start_id==target_id-7 || start_id==target_id-9) || (start_id==target_id-18 && !document.querySelector(`[square-id="${start_id+9}"]`).firstChild) ||
          (start_id==target_id-27 && !document.querySelector(`[square-id="${start_id+9}"]`).firstChild && !document.querySelector(`[square-id="${start_id+18}"]`).firstChild) ||
          (start_id==target_id-36 && !document.querySelector(`[square-id="${start_id+9}"]`).firstChild && !document.querySelector(`[square-id="${start_id+18}"]`).firstChild && !document.querySelector(`[square-id="${start_id+27}"]`).firstChild) || 
          (start_id==target_id-45 && !document.querySelector(`[square-id="${start_id+9}"]`).firstChild && !document.querySelector(`[square-id="${start_id+18}"]`).firstChild && !document.querySelector(`[square-id="${start_id+27}"]`).firstChild && !document.querySelector(`[square-id="${start_id+36}"]`).firstChild) || 
          (start_id==target_id-54 && !document.querySelector(`[square-id="${start_id+9}"]`).firstChild && !document.querySelector(`[square-id="${start_id+18}"]`).firstChild && !document.querySelector(`[square-id="${start_id+27}"]`).firstChild && !document.querySelector(`[square-id="${start_id+36}"]`).firstChild && !document.querySelector(`[square-id="${start_id+45}"]`).firstChild) ||
          (start_id==target_id-63 && !document.querySelector(`[square-id="${start_id+9}"]`).firstChild && !document.querySelector(`[square-id="${start_id+18}"]`).firstChild && !document.querySelector(`[square-id="${start_id+27}"]`).firstChild && !document.querySelector(`[square-id="${start_id+36}"]`).firstChild && !document.querySelector(`[square-id="${start_id+45}"]`).firstChild && !document.querySelector(`[square-id="${start_id+54}"]`).firstChild)
          ){
          return true;
          }
            return false;
          
    }




}



function checkForWin(){
    let kings=Array.from(document.querySelectorAll("#king"))
    if(!kings.some(king => !king.firstChild.classList.contains("piece_black"))){
        document.getElementById('info_display').innerHTML="Black wins"
        const allsquare=document.querySelectorAll('.square');
        allsquare.forEach(square => square.firstChild?.setAttribute("draggable","false"))
    }
    if(!kings.some(king => !king.firstChild.classList.contains("piece_white"))){
        document.getElementById('info_display').innerHTML="White wins"
        const allsquare=document.querySelectorAll('.square');
        allsquare.forEach(square => square.firstChild?.setAttribute("draggable","false"))
    }
}


function saveChessMatch(){
    let matchStatus=[];
    let squares=document.querySelector("#gameboard");
    //console.log(squares);
    let allSquares=squares.children;
    for(let x=0;x<allSquares.length;x++){
        let temp=[];
        temp[0]=allSquares[x].classList;
        if(allSquares[x].firstChild){
            temp[1]=allSquares[x].firstChild.id;
            temp[2]=allSquares[x].firstChild.getAttribute('draggable');
            temp[3]=allSquares[x].firstChild.getAttribute('color');
        }
        matchStatus.push(temp);
    }
    console.log(matchStatus);
    createSavedChessMatch(matchStatus);
}
var pieceObject={'rook':rook,
                 'queen':queen,
                'bishop':bishop,
                'pawn':pawn,
                'king':king,
            'knight':knight};
function createSavedChessMatch(array){
    let squares=document.querySelector("#gameboard");
    console.log(array);
    for(let x=0;x<array.length;x++){
        let square=document.createElement('div');
        square.setAttribute('square-id',x);
       // let temp=array[x][0]+"."+array[x][1];
        //console.log(temp);
        square.classList.add(array[x][0][0],array[x][0][1]);
       // square.classList.add(array[x][1]);
        if(array[x].length>1){
            console.log(array[x]);
            console.log(pieceObject)
            console.log(pieceObject[array[x][1]]);
            square.innerHTML=pieceObject[array[x][1]];
            square.firstChild.classList.add('pieces');
            square.firstChild.id=array[x][1];
            square.firstChild.setAttribute('draggable',array[x][2]);
            square.firstChild.setAttribute('color',array[x][3]);
            square.firstChild.firstChild.classList.add(array[x][3]);
        }
        squares.appendChild(square);
    }
}