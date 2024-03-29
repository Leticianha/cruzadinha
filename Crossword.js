import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Keyboard, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons/';

const Crossword = () => {
    const [guesses, setGuesses] = useState(Array(5).fill('')); 
    const [correctGuesses, setCorrectGuesses] = useState(Array(5).fill(false)); 
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [errorMessages, setErrorMessages] = useState(Array(5).fill('')); 
    const horizontalWords = ["PELE", "BRASIL", "LUA"];
    const verticalWords = ["PARIS", "SANGUE"];
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const horizontalQuestions = [
        "3. Maior órgão do corpo humano.",
        "4. Maior país da américa latina.",
        "5. Nome do satélite natural da Terra."
    ];

    const verticalQuestions = [
        "1. Capital da França.",
        "2. Líquido vermelho vital que circula pelo corpo humano, transportando oxigênio e nutrientes para as células.",
        "3. Nome do satélite natural da Terra."
    ];

    const checkGuess = (word, direction, questionIndex) => {
        return () => {
            const currentGuesses = [...guesses];
            const currentCorrectGuesses = [...correctGuesses];
            if (currentGuesses[questionIndex].trim().toLowerCase() === word.toLowerCase()) {
                currentCorrectGuesses[questionIndex] = true; 
                setCorrectGuesses(currentCorrectGuesses); 
                setErrorMessages(prev => {
                    const newErrors = [...prev];
                    newErrors[questionIndex] = ''; 
                    return newErrors;
                });
                if (!correctAnswers.includes(word)) {
                    setCorrectAnswers(prevCorrectAnswers => [...prevCorrectAnswers, word]); 
                }
            } else {
                setErrorMessages(prev => {
                    const newErrors = [...prev];
                    newErrors[questionIndex] = 'Você errou, tente novamente.'; 
                    return newErrors;
                });
                Keyboard.dismiss();
            }
            if (questionIndex === guesses.length - 1 && currentGuesses[questionIndex].trim() === '') {
                setErrorMessages(prev => {
                    const newErrors = [...prev];
                    newErrors[questionIndex] = 'Responda esta pergunta.'; 
                    return newErrors;
                });
            }
        };
    };


    const handleQuestionSelection = (index) => {
        setSelectedQuestion(index);
        setErrorMessages(prev => prev.map(() => '')); 
    };

    const handleInputChange = (text, index) => {
        const newGuesses = [...guesses];
        newGuesses[index] = text;
        setGuesses(newGuesses);
        setErrorMessages(prev => prev.map(() => '')); 
    };

    const renderQuestion = (word, index, direction, question) => {
        const questionIndex = direction === "horizontal" ? index + 3 : index;
        return (
            <View key={questionIndex} style={styles.questionContainer}>
                <TouchableOpacity
                    style={[styles.question, selectedQuestion === questionIndex && styles.selected, correctGuesses[questionIndex] && styles.correct]}
                    onPress={() => handleQuestionSelection(questionIndex)}
                >
                    <Text style={[styles.questionText, { color: '#fff' }]}>{question}</Text>
                    {selectedQuestion === questionIndex && (
                        <View style={styles.linhaReta}>
                            <>
                                <TextInput
                                    style={[styles.input, { color: '#fff' }]}
                                    value={guesses[questionIndex]}
                                    onChangeText={(text) => handleInputChange(text, questionIndex)}
                                />
                                <TouchableOpacity
                                    style={styles.checkButton}
                                    onPress={checkGuess(word, direction, questionIndex)}
                                >
                                    <View style={styles.checkButtonIconContainer}>
                                        <Ionicons size={25} color={"#fff"} name="checkmark-circle" />
                                    </View>
                                </TouchableOpacity>
                                {errorMessages[questionIndex] && (
                                    <Text style={[styles.incorrect, { color: 'red' }]}>{errorMessages[questionIndex]}</Text>
                                )}
                            </>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    const renderQuestions = (words, questions, direction) => {
        return words.map((word, index) => renderQuestion(word, index, direction, questions[index]));
    };

    const renderVerticalAnswer = (word) => {
        let className = '';
        switch (word) {
            case 'PARIS':
                className = 'resp1';
                break;
            case 'SANGUE':
                className = 'resp2';
                break;
            default:
                break;
        }

        return (
            <View key={word} style={styles.verticalAnswerContainer}>
                {word.split('').map((letter, index) => (
                    <View key={index} style={{ position: 'absolute', top: index * 20, left: 0 }}>
                        <Text style={[styles.answerText, styles[className], { textAlign: 'center' }, { color: '#CFB9E5' }]}>{letter}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const renderHorizontalAnswer = (word) => {
        let className = '';
        switch (word) {
            case 'LUA':
                className = 'resp3';
                break;
            case 'PELE':
                className = 'resp4';
                break;
            case 'BRASIL':
                className = 'resp5';
                break;
            default:
                break;
        }

        return (
            <Text key={word} style={[styles.answerText, styles[className], { color: '#CFB9E5' }]}>{word}</Text>
        );
    };

    const handleRestart = () => {
        setGuesses(Array(5).fill(''));
        setCorrectGuesses(Array(5).fill(false));
        setSelectedQuestion(null);
        setErrorMessages(Array(5).fill(''));
        setCorrectAnswers([]);
        setShowModal(false);
    };

    return (
        <ScrollView style={styles.ScrollView}>
            <View style={styles.header}></View>
            <View contentContainerStyle style={styles.container}>
                <View style={styles.perguntas}>
                    <View style={styles.verticalQuestions}>
                        <Text style={[styles.sectionTitleV, { color: '#fff' }]}>VERTICAL:</Text>
                        {renderQuestions(verticalWords, verticalQuestions, "vertical")}
                    </View>
                    <View style={styles.horizontalQuestions}>
                        <Text style={[styles.sectionTitleH, { color: '#fff' }]}>HORIZONTAL:</Text>
                        {renderQuestions(horizontalWords, horizontalQuestions, "horizontal")}
                    </View>
                </View>
                <View style={styles.answersContainer}>
                    <Text style={[styles.sectionTitleC, { color: '#fff' }]}>CRUZADINHA:</Text>
                    <View style={styles.answersList}>
                        <View style={styles.verticalAnswers}>
                            {correctAnswers.filter(word => verticalWords.includes(word)).map((answer, index) => (
                                renderVerticalAnswer(answer)
                            ))}
                        </View>
                        <View style={styles.horizontalAnswers}>
                            {correctAnswers.filter(word => horizontalWords.includes(word)).map((answer, index) => (
                                renderHorizontalAnswer(answer)
                            ))}
                        </View>
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={correctAnswers.length === 5}
                        onRequestClose={() => {
                            setShowModal(false);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={[styles.modalText, { color: '#3C4146' }]}>Você ganhou!</Text>
                                <TouchableOpacity
                                    style={[styles.restartButton, { width: 115, backgroundColor: 'rgb(164 137 191)', borderRadius: 6, marginTop: 0 }]}
                                    onPress={handleRestart}
                                >
                                    <Text style={styles.restartButtonText}>Reiniciar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 180,
        backgroundColor: '#fff'
    },
    ScrollView: {
        backgroundColor: '#3C4146'
    },
    container: {
        margin: 50,
        color: '#fff'
    },
    perguntas: {
        height: 260,
    },
    sectionTitleV: {
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#fff'
    },
    sectionTitleH: {
        fontWeight: 'bold',
        marginBottom: 6,
        marginTop: 15,
        color: '#fff'
    },
    sectionTitleC: {
        fontWeight: 'bold',
        marginBottom: 6,
        marginTop: 15,
        color: '#fff'
    },
    input: {
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 8,
        width: 199,
        height: 25,
        marginTop: 5,
        marginBottom: 5,
        paddingLeft: 10
    },
    linhaReta: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap'
    },
    verticalQuestions: {
        color: '#fff'
    },
    checkButton: {
        width: 30,
        height: 30,
        borderRadius: 10,
        backgroundColor: '3C4146', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkButtonIconContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '3C4146'
    },
    answerText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    incorrect: {
        color: 'red',
    },
    answersContainer: {
        marginTop: -15,
    },
    answersList: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    verticalAnswers: {
        marginRight: 20,
    },
    horizontalAnswers: {
        flexDirection: 'row',
    },
    verticalAnswerContainer: {
        marginRight: 10,
    },
    winMessage: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'green',
    },
    resp1: {
        position: 'absolute',
        top: 5,
        left: 115
    },
    resp2: {
        position: 'absolute',
        top: 45,
        left: 83
    },
    resp3: {
        position: 'absolute',
        letterSpacing: 3,
        top: 125,
        left: 40
    },
    resp4: {
        position: 'absolute',
        top: 6,
        left: 85,
        letterSpacing: 3
    },
    resp5: {
        position: 'absolute',
        top: 65,
        left: 21,
        letterSpacing: 3
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#CFB9E5'
    },
    restartButton: {
        backgroundColor: 'rgb(164 137 191)',
        borderRadius: 6,
        padding: 10,
        marginTop: 0,
        alignItems: 'center',
    },
    restartButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Crossword;
