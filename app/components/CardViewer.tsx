'use client';

import { useState } from 'react';
import MarkdownContent from './Markdown';

interface Card {
    _id: string;
    front: string;
    back: string;
}

interface CardViewerProps {
    cards: Card[];
}

export default function CardViewer({ cards }: CardViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showBack, setShowBack] = useState(false);
    const [finished, setFinished] = useState(false);

    if (cards.length === 0) {
        return <div>No cards in this deck.</div>;
    }

    const currentCard = cards[currentIndex];

    const handleFlip = () => {
        setShowBack(true);
    };

    const handleNext = () => {
        if (currentIndex + 1 >= cards.length) {
            setFinished(true);
        } else {
            setCurrentIndex(prev => prev + 1);
            setShowBack(false);
        }
    };

    if (finished) {
        return (
            <div style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                height: 'calc(100vh - 30px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    width: '700px',
                    height: '200px',
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    textAlign: 'center'
                }}>
                    <p>Finalizado!</p>
                    <button
                        onClick={() => {
                            setCurrentIndex(0);
                            setShowBack(false);
                            setFinished(false);
                        }}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Repetir
                    </button>
                </div>
            </div>
        );
    }

    const progress = ((currentIndex + (showBack ? 1 : 0)) / cards.length) * 100;

    return (
        <div style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: 'calc(100vh - 100px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                width: '700px',
                marginBottom: '20px',
                height: '10px',
                backgroundColor: '#e0e0e0',
                borderRadius: '5px',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    backgroundColor: '#007bff',
                    transition: 'width 0.3s ease'
                }}></div>
            </div>
            <div style={{
                width: '60%',
                height: '80%',
                perspective: '1000px'
            }}>
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: showBack ? 'transform 0.6s' : 'none',
                    transform: showBack ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}>
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f9f9f9',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                        padding: '20px',
                        textAlign: 'center',
                    }}>
                        <div
                            className="markdown-scope"
                            style={{
                                alignSelf: 'stretch',
                                flex: 1,
                                minHeight: 0,
                                overflowY: 'auto',
                                padding: '0 8px'
                            }}
                        >
                            <MarkdownContent content={currentCard.front} />
                        </div>
                        <button
                            onClick={handleFlip}
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Ver Resposta
                        </button>
                    </div>
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f9f9f9',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                        padding: '20px',
                        textAlign: 'center'
                    }}>
                        <div
                            className="markdown-scope"
                            style={{
                                alignSelf: 'stretch',
                                flex: 1,
                                minHeight: 0,
                                overflowY: 'auto',
                                padding: '0 8px'
                            }}
                        >
                            <MarkdownContent content={currentCard.back} />
                        </div>
                        <button
                            onClick={handleNext}
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Próximo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
