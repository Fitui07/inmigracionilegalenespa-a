document.addEventListener('DOMContentLoaded', function() {
    // Accordion functionality
    var accordions = document.querySelectorAll('.accordion');

    accordions.forEach(function(acc) {
        acc.addEventListener('click', function() {
            this.classList.toggle('active');
            var panel = this.nextElementSibling;

            // This function walks up the DOM and adjusts the max-height of any parent accordions
            const adjustParentPanels = (elem) => {
                let parent = elem.closest('.panel');
                while (parent) {
                    // Only adjust if the parent is actually open
                    if (parent.style.maxHeight) {
                        parent.style.maxHeight = parent.scrollHeight + 'px';
                    }
                    parent = parent.parentElement.closest('.panel');
                }
            };

            if (panel.style.maxHeight) { // If panel is open, we close it
                panel.style.maxHeight = null;
                // We must also adjust the parents' height since this panel is closing.
                adjustParentPanels(panel);
            } else { // If panel is closed, we open it
                panel.style.maxHeight = panel.scrollHeight + 'px';

                // When the opening animation is done, we update the parents' height.
                // This is crucial because the parent's scrollHeight is only final
                // after the child's transition is complete.
                const onTransitionEnd = (event) => {
                    if (event.propertyName === 'max-height') {
                        adjustParentPanels(panel);
                        // Clean up the event listener
                        panel.removeEventListener('transitionend', onTransitionEnd);
                    }
                };
                panel.addEventListener('transitionend', onTransitionEnd);
            }
        });
    });

    // Scroll to top button functionality
    var btnScrollToTop = document.getElementById('btn-volver-arriba');
    if (btnScrollToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                btnScrollToTop.style.display = 'block';
            } else {
                btnScrollToTop.style.display = 'none';
            }
        });

        btnScrollToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Quiz functionality
    const quizForm = document.getElementById('quiz-form');
    if (quizForm) {
        const submitQuizButton = document.getElementById('submit-quiz');
        const resetQuizButton = document.getElementById('reset-quiz');
        const quizResultsDiv = document.getElementById('quiz-results');
        const questions = quizForm.querySelectorAll('.question');

        questions.forEach((question) => {
            const options = question.querySelectorAll('.options label');
            options.forEach((option) => {
                option.addEventListener('click', function() {
                    // Remove selected class from all options in the same question
                    options.forEach((opt) => opt.classList.remove('selected'));
                    // Add selected class to the clicked option
                    this.classList.add('selected');
                });
            });
        });

        submitQuizButton.addEventListener('click', function() {
            let score = 0;

            questions.forEach((question, index) => {
                const selectedOption = question.querySelector(`input[name="q${index + 1}"]:checked`);
                const feedbackDiv = question.querySelector('.feedback');
                const correctValue = question.dataset.correct;

                feedbackDiv.innerHTML = ''; // Clear previous feedback
                feedbackDiv.classList.remove('correct', 'incorrect');

                if (selectedOption) {
                    const parentLabel = selectedOption.parentElement;
                    if (selectedOption.value === correctValue) {
                        score++;
                        parentLabel.classList.add('correct');
                    } else {
                        parentLabel.classList.add('incorrect');
                    }
                } else {
                    feedbackDiv.innerHTML = 'Por favor, selecciona una opción.';
                    feedbackDiv.classList.add('incorrect');
                }
            });

            quizResultsDiv.innerHTML = `Has obtenido ${score} de ${questions.length} respuestas correctas.`;
            quizResultsDiv.style.fontWeight = 'bold';
        });

        resetQuizButton.addEventListener('click', function() {
            questions.forEach((question) => {
                const selectedOption = question.querySelector('input:checked');
                if (selectedOption) {
                    selectedOption.checked = false;
                }
                const feedbackDiv = question.querySelector('.feedback');
                feedbackDiv.innerHTML = '';
                const options = question.querySelectorAll('.options label');
                options.forEach((option) => {
                    option.classList.remove('selected', 'correct', 'incorrect');
                });
            });
            quizResultsDiv.innerHTML = '';
        });
    }

    // Chart.js functionality for "Factores Impulsores de la Inmigración Ilegal"
    const ctx = document.getElementById('migrationChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    'Pobreza y falta de oportunidades',
                    'Conflictos armados o persecución política',
                    'Redes criminales',
                    'Cambio climático'
                ],
                datasets: [{
                    label: 'Porcentaje de Impacto',
                    data: [40, 25, 25, 10], // Hypothetical data
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)', // Red
                        'rgba(54, 162, 235, 0.8)', // Blue
                        'rgba(255, 206, 86, 0.8)', // Yellow
                        'rgba(75, 192, 192, 0.8)'  // Green
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#f0f0f0' // Direct color for better visibility
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribución de Factores Impulsores',
                        color: '#FFFFFF' // Direct white color for visibility
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += context.parsed + '%';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Bar Chart functionality for "Aumento de Inmigración Ilegal en España (1960-2024)"
    const barCtx = document.getElementById('barChart');
    if (barCtx) {
        const years = [1960, 1970, 1980, 1990, 2000, 2010, 2020, 2021, 2022, 2023, 2024];
        const arrivals = [5000, 7000, 10000, 15000, 23000, 40000, 41861, 41945, 31219, 56852, 63970];

        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: 'Llegadas Irregulares Estimadas',
                    data: arrivals,
                    backgroundColor: 'rgba(153, 102, 255, 0.8)', // Purple
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#f0f0f0'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Aumento de Inmigración Ilegal en España (1960-2024)',
                        color: '#FFFFFF'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toLocaleString() + ' personas';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#f0f0f0',
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#f0f0f0'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    }
                },
                animation: {
                    duration: 2000, // Animation duration in milliseconds
                    easing: 'easeInOutQuart' // Easing function for animation
                }
            }
        });
    }

});
