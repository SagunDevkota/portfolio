// Retro Portfolio Interactive Scripts

// Typing animation for hero section
const typingTexts = [
    'whoami',
    'cat about.txt',
    'ls projects/',
    'contact --help'
];

let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function typeText() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const currentText = typingTexts[currentTextIndex];

    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
        currentCharIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
        currentCharIndex++;
    }

    if (!isDeleting && currentCharIndex === currentText.length) {
        isDeleting = true;
        setTimeout(typeText, pauseTime);
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
        setTimeout(typeText, 500);
    } else {
        const speed = isDeleting ? deletingSpeed : typingSpeed;
        setTimeout(typeText, speed);
    }
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeText, 1000);
    
    // Store original heights for each card
    const cardHeights = new Map();
    // Store maximum row heights to maintain layout stability
    const rowMaxHeights = new Map();
    
    // Function to store a card's natural expanded height
    const storeCardHeight = (card) => {
        if (card.classList.contains('collapsed')) return;
        
        // Temporarily remove height constraint to get natural height
        const currentHeight = card.style.height;
        card.style.height = 'auto';
        const naturalHeight = card.offsetHeight;
        card.style.height = currentHeight || 'auto';
        
        cardHeights.set(card, naturalHeight);
    };
    
    // Function to match heights of expanded cards in the same row
    const matchCardHeights = (maintainRowHeight = false) => {
        const cards = document.querySelectorAll('.project-card');
        const grid = document.querySelector('.projects-grid');
        if (!grid) return;
        
        // Store natural heights for all expanded cards first
        cards.forEach(card => {
            if (!card.classList.contains('collapsed')) {
                storeCardHeight(card);
            }
        });
        
        // Get all rows
        const gridRect = grid.getBoundingClientRect();
        const cardRects = Array.from(cards).map(card => ({
            card,
            rect: card.getBoundingClientRect()
        }));
        
        // Group all cards by row (both expanded and collapsed)
        const allRows = {};
        cardRects.forEach(({ card, rect }) => {
            const rowKey = Math.round(rect.top);
            if (!allRows[rowKey]) {
                allRows[rowKey] = [];
            }
            allRows[rowKey].push(card);
        });
        
        // Process each row
        Object.entries(allRows).forEach(([rowKey, rowCards]) => {
            const expandedCards = rowCards.filter(card => !card.classList.contains('collapsed'));
            const collapsedCards = rowCards.filter(card => card.classList.contains('collapsed'));
            
            // Determine the target height for this row
            let targetRowHeight;
            
            if (maintainRowHeight && rowMaxHeights.has(rowKey)) {
                // Use stored maximum row height to prevent layout shift
                targetRowHeight = rowMaxHeights.get(rowKey);
            } else {
                // Calculate maximum height from all expanded cards' stored heights
                const expandedHeights = expandedCards.map(card => {
                    return cardHeights.get(card) || card.offsetHeight;
                });
                targetRowHeight = expandedHeights.length > 0 ? Math.max(...expandedHeights) : 0;
                
                // Store the maximum row height for future use
                if (targetRowHeight > 0) {
                    rowMaxHeights.set(rowKey, targetRowHeight);
                }
            }
            
            // Set height for expanded cards to match row height
            if (expandedCards.length > 0 && targetRowHeight > 0) {
                expandedCards.forEach(card => {
                    card.style.height = targetRowHeight + 'px';
                    cardHeights.set(card, targetRowHeight);
                });
            } else if (expandedCards.length === 1) {
                // Single expanded card - use its natural height
                const singleCard = expandedCards[0];
                const naturalHeight = cardHeights.get(singleCard) || singleCard.offsetHeight;
                singleCard.style.height = naturalHeight + 'px';
                cardHeights.set(singleCard, naturalHeight);
                if (naturalHeight > 0) {
                    rowMaxHeights.set(rowKey, naturalHeight);
                }
            }
            
            // Collapsed cards are allowed to shrink (height: auto)
            // They don't affect the row height, which is maintained by expanded cards
        });
    };
    
    // Collapse/Expand functionality for project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        const header = card.querySelector('.project-header');
        const content = card.querySelector('.project-content');
        const toggleBtn = card.querySelector('.collapse-toggle');
        
        if (header && toggleBtn && content) {
            header.style.cursor = 'pointer';
            
            // Store original values
            const originalHeaderMargin = window.getComputedStyle(header).marginBottom;
            const originalCardPadding = window.getComputedStyle(card).padding;
            
            // Initialize expanded state
            const setExpanded = () => {
                // Temporarily remove max-height to get accurate scrollHeight
                content.style.maxHeight = 'none';
                const height = content.scrollHeight;
                content.style.maxHeight = height + 'px';
                content.style.opacity = '1';
                content.style.overflow = 'visible';
                content.style.paddingTop = '';
                content.style.paddingBottom = '';
                header.style.marginBottom = originalHeaderMargin;
            };
            
            // Set transition
            content.style.transition = 'max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease';
            card.style.transition = 'height 0.3s ease, padding 0.3s ease';
            
            // Initialize as expanded
            setTimeout(() => {
                setExpanded();
                // Store the natural height after initial expansion
                storeCardHeight(card);
                matchCardHeights();
            }, 100 + (index * 50)); // Stagger initialization slightly
            
            const toggleCollapse = (e) => {
                if (e) {
                    e.stopPropagation();
                }
                
                const isCollapsed = card.classList.contains('collapsed');
                
                if (isCollapsed) {
                    // Expand
                    card.classList.remove('collapsed');
                    
                    // Restore content first
                    setExpanded();
                    toggleBtn.textContent = '[-]';
                    
                    // Use stored height if available, otherwise calculate
                    const storedHeight = cardHeights.get(card);
                    if (storedHeight) {
                        // Set height immediately to stored value for smooth expansion
                        card.style.height = storedHeight + 'px';
                    } else {
                        // Calculate natural height
                        card.style.height = 'auto';
                        setTimeout(() => {
                            storeCardHeight(card);
                        }, 50);
                    }
                    
                    // Match heights after expansion animation completes
                    // Allow natural growth when expanding
                    setTimeout(() => {
                        matchCardHeights(false);
                    }, 350);
                } else {
                    // Collapse - hide content and allow card to shrink
                    // Store current height before collapsing if not already stored
                    if (!cardHeights.has(card)) {
                        storeCardHeight(card);
                    }
                    
                    card.classList.add('collapsed');
                    // Allow collapsed card to shrink to its natural collapsed height
                    card.style.height = 'auto';
                    content.style.maxHeight = '0';
                    content.style.opacity = '0';
                    content.style.overflow = 'hidden';
                    content.style.paddingTop = '0';
                    content.style.paddingBottom = '0';
                    header.style.marginBottom = '0';
                    toggleBtn.textContent = '[+]';
                    
                    // Match heights of remaining expanded cards
                    // Maintain row height to prevent layout shift
                    setTimeout(() => {
                        matchCardHeights(true);
                    }, 350);
                }
            };
            
            const handleHeaderClick = (e) => {
                // Only toggle if clicking on the header itself, not on the toggle button
                if (e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
                    toggleCollapse(e);
                }
            };
            
            header.addEventListener('click', handleHeaderClick);
            toggleBtn.addEventListener('click', toggleCollapse);
            
            // Hover effect for border color
            card.addEventListener('mouseenter', function() {
                this.style.borderColor = 'var(--terminal-text)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.borderColor = 'var(--terminal-border)';
            });
        }
    });
    
    // Match heights on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            matchCardHeights();
        }, 250);
    });
    
    // Collapse/Expand functionality for section headers
    document.querySelectorAll('.terminal-window').forEach(window => {
        const header = window.querySelector('.terminal-header-small');
        const content = window.querySelector('.terminal-content');
        const toggleBtn = header?.querySelector('.section-toggle');
        
        if (header && content && toggleBtn) {
            header.style.cursor = 'pointer';
            
            // Initialize expanded state
            const setExpanded = () => {
                content.style.maxHeight = 'none';
                const height = content.scrollHeight;
                content.style.maxHeight = height + 'px';
                content.style.opacity = '1';
                content.style.overflow = 'visible';
                toggleBtn.textContent = '▼';
            };
            
            // Set transition
            content.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
            
            // Initialize as expanded
            setTimeout(() => {
                setExpanded();
            }, 100);
            
            const toggleCollapse = () => {
                const isCollapsed = window.classList.contains('section-collapsed');
                
                // Add animation class
                if (isCollapsed) {
                    header.classList.add('expanding');
                    header.classList.remove('collapsing');
                } else {
                    header.classList.add('collapsing');
                    header.classList.remove('expanding');
                }
                
                if (isCollapsed) {
                    // Expand
                    window.classList.remove('section-collapsed');
                    setExpanded();
                    toggleBtn.textContent = '▼';
                } else {
                    // Collapse
                    window.classList.add('section-collapsed');
                    content.style.maxHeight = '0';
                    content.style.opacity = '0';
                    content.style.overflow = 'hidden';
                    toggleBtn.textContent = '▶';
                }
                
                // Remove animation class after animation completes
                setTimeout(() => {
                    header.classList.remove('expanding', 'collapsing');
                }, 400);
            };
            
            header.addEventListener('click', toggleCollapse);
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleCollapse();
            });
            
            // Add hover effect with glow
            header.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 2px 15px rgba(0, 255, 65, 0.4)';
            });
            
            header.addEventListener('mouseleave', function() {
                this.style.boxShadow = '';
            });
        }
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Terminal window controls animation
document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
});

// Add glow effect on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInGlow 0.8s ease-in';
            entry.target.style.opacity = '1';
        }
    });
}, observerOptions);

// Observe all terminal windows
document.querySelectorAll('.terminal-window').forEach(window => {
    window.style.opacity = '0';
    observer.observe(window);
});

// Add fade in glow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInGlow {
        from {
            opacity: 0;
            transform: translateY(20px);
            filter: blur(5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
        }
    }
`;
document.head.appendChild(style);

// Add random glitch effect to terminal text
function addGlitchEffect() {
    const glitchElements = document.querySelectorAll('.retro-title, .terminal-title');
    glitchElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.animation = 'glitch 0.3s infinite';
        });
        element.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });
}

addGlitchEffect();

// Terminal cursor blink animation
const cursor = document.querySelector('.cursor-blink');
if (cursor) {
    setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    }, 530);
}

// Add particle effect on hover for skill tags
document.querySelectorAll('.skill-tag, .tech-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.textShadow = '0 0 10px var(--terminal-glow), 0 0 20px var(--terminal-glow)';
    });
    tag.addEventListener('mouseleave', function() {
        this.style.textShadow = '';
    });
});

// Add typing sound effect (optional - can be enabled if sound files are added)
function playTypingSound() {
    // Placeholder for typing sound effect
    // const audio = new Audio('sounds/typing.mp3');
    // audio.volume = 0.1;
    // audio.play();
}

// Add retro terminal beep on link click
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
        // Optional: Add beep sound
        // playBeepSound();
    });
});

// Console easter egg
let konamiCode = [];
const konamiPattern = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 2000);
    }
});

// Add date/time display in terminal prompt (optional)
function updateTerminalPrompt() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    // Could add this to terminal prompt if desired
}

// Update every second
// setInterval(updateTerminalPrompt, 1000);

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

// Add retro scanline effect toggle (optional)
let scanlinesEnabled = true;
function toggleScanlines() {
    const scanlines = document.querySelector('.scanlines');
    if (scanlines) {
        scanlines.style.display = scanlinesEnabled ? 'none' : 'block';
        scanlinesEnabled = !scanlinesEnabled;
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'S' to toggle scanlines
    if (e.key === 's' || e.key === 'S') {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleScanlines();
        }
    }
    
    // Press 'H' to go to home
    if (e.key === 'h' || e.key === 'H') {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add retro terminal command history (for fun)
const commandHistory = [];
let historyIndex = -1;

// Simulate terminal commands
function executeCommand(command) {
    commandHistory.push(command);
    historyIndex = commandHistory.length;
    
    // Could add actual command execution here
    console.log(`Executing: ${command}`);
}


// Performance optimization: Reduce animations on low-end devices
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

// Add retro terminal startup sound effect (optional)
function playStartupSound() {
    // Placeholder for startup sound
    // const audio = new Audio('sounds/startup.mp3');
    // audio.volume = 0.2;
    // audio.play();
}

// Initialize on page load
window.addEventListener('load', () => {
    // playStartupSound();
    console.log('%c RETRO PORTFOLIO v1.0 ', 'background: #00ff41; color: #0a0e27; font-size: 20px; font-weight: bold;');
    console.log('%c Welcome to the terminal! ', 'background: #0a0e27; color: #00ff41; font-size: 14px;');
    console.log('%c Type "help" for available commands ', 'color: #00cc33; font-size: 12px;');
});

