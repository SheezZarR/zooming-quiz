import React from "react"
import { createSmartappDebugger, createAssistant } from "@salutejs/client";

import questions from "./consts";
import QuestionWindow from "./HomePage/QuestionWindow";
import Result from "./HomePage/Result";

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJmNmJiZGJhMC1mZWY1LTQwNWMtYjg0Mi01NDRjNTYzNWUzMWEiLCJzdWIiOiJmZjAwMTE4OWVmNjQ2YzhjYTg3NmQwYmFkY2Y0MTQ4NmI4MDVmYWVkNWRlMGIyNGQzYWM4MDgzMzA5OTcwNDdkYWZjYzciLCJpc3MiOiJLRVlNQVNURVIiLCJleHAiOjE3MDk3NTE5MDgsImF1ZCI6IlZQUyIsImlhdCI6MTcwOTY2NTQ5OCwic2lkIjoiZjAyODE0ZjYtNjRlYy00MGNjLWE3MTgtMmI0NDNiZDEwNmVmIn0.O8rdZcp4z7LIcT3jwdsuyztQ5dIet6i1ssxFjOi2Chzy3excLIH-bEzRja31D-xPNER8D2BZl42BQ2Y7_Dp3a4MtnMC6oeq3Ac4mOvp-hNJOusmm1fu4ZN26mLQdmRqlaUfsG5YHk7-73joiIL08CXtr5oz9sGuaYa27K9WeSJfrA0Clux5DyKLeaogjD9QN2sZVtMFd6Q8YBJ6JVaVZ-q1w4WQqVQxTil64fkyHgXKKA10m0i5pxO9qMISbOX5CCh4-gOpJCYFxNT67xBeyiAdWDfUsY-VOaeHkBCXsgjlYf4XBDepv-So2rAkU8hh8frrZRHomPsRfbvvkTg0CYGZnzA-agGw8lf5rQaPFVnKEcPB549V4Lx3vp46A9MZyfXWNfG9rda3B0-TJQjO6hC3kmFnTZVG5Qvjy4NE0enaMCMkbaD81stJ-UdixCJyMKukU6y2K-piiSkLh4QZ7qtH75IZqs9Kl4zfVDai9TNwpQYSPaUou2Oty7CUPl-ulviXsj2HdJX2GHtWX0qGZCSwP6yKqIZ4RhZh8wG-Ih5YqTARA0hZbODRH_1J6DUOqpLjRJy4Yexb8YKmOPiKnY5-4nPa16ukCxOFMJNKHuILlJTdfSIiNzIQqBd35BaBaniC7B6R9X2ldE79mNNM8cG9cPNGuFStZtM1zbVSiLvE"
function initializeAssistant(getState){
    if (process.env.NODE_ENV === "development"){
        return createSmartappDebugger({
            token: token,
            initPhrase: "Включи Квиз о Мире",
            getState,
        })
    }

    return createAssistant({ getState });
}

class App extends React.Component {
    constructor(props) {
      console.log("constructor")
      super(props);
      this.state = {
        step: 0,
        answerIdx: null,
        isCorrect: null,
        brandCorrect: 0,
        natureCorrect: 0,
        isClickable : true
      };
      this.assistant = initializeAssistant(() => this.getStateForAssistant())
      this.assistant.on("data", (event) => {
        console.log(`assistant.on(data)`, event);
    });
    this.assistant.on("start", (event) => {
        console.log(`assistant.on(start)`, event);
    });
    }

    getStateForAssistant() {
        console.log('getStateForAssistant: state:', this.state);
        return this.state;
    }

    dispatchAssistantData(data) {
      console.log('dispatchAssistantData', data);
    }

    sendDataToAssistant(data) {
      console.log("sendDataToAssistant", data);
      this.assistant.sendData({action: {action_id : "start"}})
    }

    onClick = (index) => {
      const { step, brandCorrect, natureCorrect } = this.state;
      const question = questions[step];
      console.log(question.correct)
  
      if (step % 2 === 0) {
        if (index === question.correct) {
          this.setState({ isCorrect: true, brandCorrect: brandCorrect + 1, answerIdx : index, isClickable : false });
        } else {
          this.setState({ isCorrect: false, answerIdx : index, isClickable : false });
        }
      } else {
        if (index === question.correct) {
          this.setState({ isCorrect: true, natureCorrect: natureCorrect + 1, answerIdx : index, isClickable : false });
        } else {
          this.setState({ isCorrect: false, answerIdx : index, isClickable : false });
        }
      }
  
      //this.setState({ answerIdx: index });
      //console.log("set state answerIdx")
  
      setTimeout(() => {
        this.setState({
          isClickable : true,
          answerIdx: null,
          isCorrect: null,
          step: step + 1
        });
      }, 4000);
    }
  
    render() {
      const { step, answerIdx, isCorrect, brandCorrect, natureCorrect, isClickable } = this.state;
      const question = questions[step];
      console.log("render")
  
      if (step !== questions.length) {
        return (
          <QuestionWindow
            question={question}
            step={step}
            onClick={this.onClick}
            answerIdx={answerIdx}
            isCorrect={isCorrect}
            isClickable = {isClickable}
          />
        );
      } else {
        return (
          <Result
            brandCorrect={brandCorrect}
            natureCorrect={natureCorrect}
          />
        );
      }
    }
  }
  
  export default App;