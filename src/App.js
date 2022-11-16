import './App.css';
import React from 'react';
import {DrawInfo} from './DrawInfo'

let {useState, useEffect} = React;
let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let creating = false;
let rotating = false;
let changingColor = false;
let createSquare = false;
let xy = false;
let wh = false;
let moving = false;
let buildDrawing;

const wrapper = document.getElementById("canvasWrapper");
canvas.width = wrapper.offsetWidth;
canvas.height = wrapper.offsetHeight;

var Nums = {
  'zero': 0,
  'one': 1,
  'two': 2,
  'three': 3,
  'four': 4,
  'five': 5,
  'six': 6,
  'seven': 7,
  'eight': 8,
  'nine': 9,
  'ten': 10,
  'eleven': 11,
  'twelve': 12,
  'thirteen': 13,
  'fourteen': 14,
  'fifteen': 15,
  'sixteen': 16,
  'seventeen': 17,
  'eighteen': 18,
  'nineteen': 19,
  'twenty': 20
};

function App() {
  let [phrase, setPhrase] = useState('Click here');
  let [drawings, setDrawings] = useState({objects: []});
  let [transcript, setTranscript] = useState('');
  let [selected, setSelected] = useState('');
  useEffect(()=>{
    console.log('drawings: ',drawings.objects)
    draw();

  },[drawings])

  useEffect(()=>{
    if(transcript) checkPhrase();
  },[transcript])

  useEffect(()=>{
    console.log('selected: ', selected);
    if(drawings.objects[selected]) {
      let tempDrawings = drawings.objects;
      tempDrawings[selected].stroke = '#ff0000';
      setDrawings({objects: tempDrawings});
      setPhrase('Object select, What would you like to do? (move, delete, change color)')
    } else {
      setPhrase('Click here');
    }
  },[selected])


  let listener = new SpeechRecognition();
  document.body.onclick = () => {
    setPhrase('listening...');
    listener.start();
    console.log('listening');
  }
  listener.onresult = (event) => {
    //setPhrase(event.results[0][0].transcript +'. (confidence: '+ Math.floor(event.results[0][0].confidence * 100) + '%)');
    console.log('speechResult: ', event.results[0][0].transcript);
    console.log('Confidence: ' + Math.floor(event.results[0][0].confidence * 100) + '%');
    setTranscript(event.results[0][0].transcript);
  }
  listener.onspeechend = function() {
    console.log('speech end');
    listener.stop();
  }
  listener.onerror = function(event) {
    console.log('error:', event.error);
  }
  let checkPhrase = () => {
    if(!creating  && !moving && (transcript.includes('create Square') || transcript.includes('create a square'))) {
      console.log('creating square');
      creating = true;
      createSquare = true;
      xy = true;
      buildDrawing = new DrawInfo();
      setPhrase('Say the x,y coordinates to draw at (ex: 100 by 100)');
    } else if (creating && createSquare && xy) {
      let coords = transcript.split(' ');
      buildDrawing.x = Number(coords[0]) || convertToNumber(coords[0]);
      buildDrawing.y = Number(coords[2]) || convertToNumber(coords[2]);
      console.log('set coords: ',coords[0],coords[2]);
      if(typeof buildDrawing.x === 'number' && typeof buildDrawing.y === 'number') {
        xy = false;
        wh = true;
        setPhrase('Say the width and height in pixels to draw (ex: 100 by 100)');
      } else {
        setPhrase('sorry, please try again');
      }
    } else if (creating && createSquare && wh) {
      let coords = transcript.split(' ');
      buildDrawing.width = Number(coords[0]) || convertToNumber(coords[0]);
      buildDrawing.height = Number(coords[2]) || convertToNumber(coords[2]);
      console.log('set lengths: ',coords[0],coords[2]);
      if(typeof buildDrawing.width === 'number' && typeof buildDrawing.height === 'number') {
        wh = false;
        creating = false;
        setPhrase('drawing...');
        let curDrawings = [...drawings.objects];
        curDrawings.push(buildDrawing);
        setDrawings({objects: curDrawings});
      } else {
        setPhrase('sorry, please try again');
      }
    } else if(!creating  && !moving && transcript.includes('select')) {
      let coord = transcript.split(' ');
      let objectNumber = Number(coord[2]) || convertToNumber(coord[2]);

      setSelected(objectNumber-1);
    } else if(!creating && transcript.includes('delete')) {
      if(selected !== '') {
        let tempDrawings = drawings.objects;
        tempDrawings.splice(selected,1);
        setSelected('');
        setDrawings({objects: tempDrawings});
      } else {
        setPhrase('select an object first');
      }
    } else if(!creating && !moving && transcript.includes('move')) {
      if(selected !== '') {
        moving = true;
        setPhrase('Say the x,y coordinates to move to (ex: 100 by 100)');
      } else {
        setPhrase('select an object first');
      }
    } else if(moving) {
      if(selected !== '') {
        let coords = transcript.split(' ');
        let tempDrawings = drawings.objects;

        tempDrawings[selected].x = Number(coords[0]) || convertToNumber(coords[0]);
        tempDrawings[selected].y = Number(coords[2]) || convertToNumber(coords[2]);
        console.log('set coords: ',coords[0],coords[2]);
        if(typeof tempDrawings[selected].x === 'number' && typeof tempDrawings[selected].y === 'number') {
          tempDrawings[selected].stroke = '#ffffff';
          setSelected('');
          moving = false;
          setDrawings({objects: tempDrawings});
        } else {
        setPhrase('sorry, please try again');
      }
      } else {
        setPhrase('select an object first');
      }
    } else if(!creating && !rotating && transcript.includes('rotate')) {
      if(selected !== '') {
        rotating = true;
        setPhrase('Say the rotation in degrees (ex. 45 degrees)');
      } else {
        setPhrase('select an object first');
      }
    } else if(rotating) {
      if(selected !== '') {
        let coords = transcript.split(' ');
        let tempDrawings = drawings.objects;

        tempDrawings[selected].rotation = Number(coords[0]) || convertToNumber(coords[0]);
        console.log('set rotation: ',coords[0]);
        if(typeof tempDrawings[selected].rotation === 'number') {
          tempDrawings[selected].stroke = '#ffffff';
          setSelected('');
          rotating = false;
          setDrawings({objects: tempDrawings});
        } else {
        setPhrase('sorry, please try again');
      }
      } else {
        setPhrase('select an object first');
      }
    } else if(!creating && !changingColor && transcript.includes('color')) {
      if(selected !== '') {
        changingColor = true;
        setPhrase('Say the color to change to (ex. blue)');
      } else {
        setPhrase('select an object first');
      }
    } else if(changingColor) {
      if(selected !== '') {
        let coords = transcript.split(' ');
        let tempDrawings = drawings.objects;

        tempDrawings[selected].fill = coords[0];
        console.log('set color: ',coords[0]);
        tempDrawings[selected].stroke = '#ffffff';
        setSelected('');
        changingColor = false;
        setDrawings({objects: tempDrawings});
      } else {
        setPhrase('select an object first');
      }
    } else {
      setPhrase('sorry, please try again');
    }

  }

  let convertToNumber = (word) => {
    if(word === 'to' || word === 'too') {
      word = 'two';
    } else if (word === 'tin' || word === 'in') {
      word = 'ten';
    }
    return Nums[word];
  }

  let draw = () => {
    context.clearRect(0,0,canvas.width, canvas.height);
    drawings.objects.forEach(drawing => {
      let translateX = drawing.x + drawing.width / 2;
      let translateY = drawing.y + drawing.height / 2;
      context.fillStyle = drawing.fill || '#ffffff';
      context.strokeStyle = drawing.stroke || '#0000ff';
      context.translate(translateX, translateY);
      context.rotate(drawing.rotation * Math.PI / 180)
      context.translate(-translateX, -translateY);
      context.beginPath();
      context.rect(drawing.x, drawing.y, drawing.width, drawing.height);

      context.closePath();
      context.fill();
      context.stroke();
      context.translate(translateX, translateY);
      context.rotate(-(drawing.rotation * Math.PI / 180))
      context.translate(-translateX, -translateY);
    })
    setPhrase('click here to draw');
  }
  return (
    <div><h2>{phrase}</h2></div>
  );
}

export default App;
