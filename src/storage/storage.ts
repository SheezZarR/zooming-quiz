type State = {
    question_num: number
}

export type QuizAction = | { type: "next_question" } | { type: "prev_question"}

export const reducer = (state: State, action: QuizAction): State => {
    switch (action.type) {
        case "next_question":
            return {
                question_num: state.question_num + 1
            }

        case "prev_question":
            return {
                question_num: state.question_num - 1
            }
        
        default:
            throw new DOMException("Bad action")
    }
}