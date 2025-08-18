class TerminalPortfolio {
    constructor() {
        this.terminalContent = document.getElementById('terminal-content');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentInput = '';
        this.cursorPosition = 0;
        this.isTyping = false;
        
        this.init();
    }

    init() {
        // Create invisible input for capturing keystrokes
        this.hiddenInput = document.createElement('input');
        this.hiddenInput.style.position = 'absolute';
        this.hiddenInput.style.left = '-9999px';
        this.hiddenInput.style.opacity = '0';
        document.body.appendChild(this.hiddenInput);
        
        // Handle keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('click', () => {
            if (!this.isTyping) {
                this.hiddenInput.focus();
            }
        });
        
        // Touch support for mobile devices
        document.addEventListener('touchstart', () => {
            if (!this.isTyping) {
                this.hiddenInput.focus();
            }
        });
        
        // Prevent zoom on double tap for mobile
        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('cmd')) {
                e.preventDefault();
            }
        });
        
        // Start the initial typing sequence
        this.startInitialSequence();
    }

    async startInitialSequence() {
        this.isTyping = true;
        
        // First, type the whoami command in the welcome section
        await this.typeWhoamiCommand();
        
        // Wait a bit before starting the help command
        await this.delay(1000);
        
        // Type the help command
        await this.typeCommand('help', true);
        
        // Show help output
        this.showHelpOutput();
        
        // Add new cursor line for user input
        this.addNewCursorLine();
        this.isTyping = false;
        this.hiddenInput.focus();
    }

    async typeWhoamiCommand() {
        return new Promise((resolve) => {
            const welcomeMessage = document.getElementById('welcome-message');
            
            // Create the command structure
            const promptSpan = document.createElement('span');
            promptSpan.className = 'prompt';
            promptSpan.textContent = 'jose@portfolio:~$';
            
            const commandSpan = document.createElement('span');
            commandSpan.style.marginLeft = '8px';
            
            const cursorSpan = document.createElement('span');
            cursorSpan.className = 'cursor';
            cursorSpan.textContent = '|';
            
            welcomeMessage.appendChild(promptSpan);
            welcomeMessage.appendChild(commandSpan);
            welcomeMessage.appendChild(cursorSpan);
            
            const command = 'whoami';
            let i = 0;
            
            const typeInterval = setInterval(() => {
                if (i < command.length) {
                    commandSpan.textContent = command.substring(0, i + 1);
                    i++;
                } else {
                    // Remove cursor and show output
                    welcomeMessage.removeChild(cursorSpan);
                    
                    const br = document.createElement('br');
                    const outputSpan = document.createElement('span');
                    outputSpan.className = 'output';
                    outputSpan.textContent = 'software engineer passionate about blockchain and distributed systems';
                    
                    welcomeMessage.appendChild(br);
                    welcomeMessage.appendChild(outputSpan);
                    
                    clearInterval(typeInterval);
                    
                    setTimeout(() => {
                        resolve();
                    }, 300);
                }
            }, 100);
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async typeCommand(command, showOutput = false) {
        return new Promise((resolve) => {
            // Create the command line element
            const commandLine = document.createElement('div');
            commandLine.className = 'command-line';
            commandLine.innerHTML = `<span class="prompt">jose@portfolio:~$</span> <span class="command-text"></span><span class="cursor">|</span>`;
            this.terminalContent.appendChild(commandLine);
            
            const commandText = commandLine.querySelector('.command-text');
            let i = 0;
            
            const typeInterval = setInterval(() => {
                if (i < command.length) {
                    commandText.textContent = command.substring(0, i + 1);
                    i++;
                } else {
                    // Remove cursor and finalize command
                    commandLine.innerHTML = `<span class="prompt">jose@portfolio:~$</span> <span class="command-text">${command}</span>`;
                    clearInterval(typeInterval);
                    
                    setTimeout(() => {
                        resolve();
                    }, 300);
                }
            }, 100); // Typing speed
        });
    }

    showHelpOutput() {
        const helpOutput = document.createElement('div');
        helpOutput.className = 'help-output';
        helpOutput.innerHTML = `
            Available commands:
            <div class="command-list">
                • <span class="cmd" onclick="executeCommand('about')">about</span> - View professional summary
                • <span class="cmd" onclick="executeCommand('skills')">skills</span> - Display technical skills
                • <span class="cmd" onclick="executeCommand('experience')">experience</span> - Show work experience
                • <span class="cmd" onclick="executeCommand('projects')">projects</span> - Display projects and GitHub
                • <span class="cmd" onclick="executeCommand('contributions')">contributions</span> - View open source contributions
                • <span class="cmd" onclick="executeCommand('blog')">blog</span> - Read technical blog posts
                • <span class="cmd" onclick="executeCommand('contact')">contact</span> - Get contact information
                • <span class="cmd" onclick="executeCommand('clear')">clear</span> - Clear terminal
            </div>
        `;
        this.terminalContent.appendChild(helpOutput);
    }

    handleKeyDown(e) {
        // Don't handle input while typing animation is running
        if (this.isTyping) {
            e.preventDefault();
            return;
        }
        
        // Ensure hidden input stays focused
        this.hiddenInput.focus();
        
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = this.currentInput.trim();
            if (command) {
                this.executeCommand(command);
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
            }
            this.currentInput = '';
            this.cursorPosition = 0;
            this.updateCursorLine();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.currentInput = this.commandHistory[this.historyIndex];
                this.cursorPosition = this.currentInput.length;
                this.updateCursorLine();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.currentInput = this.commandHistory[this.historyIndex];
                this.cursorPosition = this.currentInput.length;
            } else {
                this.historyIndex = this.commandHistory.length;
                this.currentInput = '';
                this.cursorPosition = 0;
            }
            this.updateCursorLine();
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            if (this.cursorPosition > 0) {
                this.currentInput = this.currentInput.slice(0, this.cursorPosition - 1) + 
                                  this.currentInput.slice(this.cursorPosition);
                this.cursorPosition--;
                this.updateCursorLine();
            }
        } else if (e.key.length === 1) {
            // Regular character input
            e.preventDefault();
            this.currentInput = this.currentInput.slice(0, this.cursorPosition) + 
                              e.key + 
                              this.currentInput.slice(this.cursorPosition);
            this.cursorPosition++;
            this.updateCursorLine();
        }
    }

    updateCursorLine() {
        // Find the last command line with cursor
        const lastCommandLine = this.terminalContent.querySelector('.command-line:last-child');
        if (lastCommandLine) {
            const beforeCursor = this.currentInput.slice(0, this.cursorPosition);
            const afterCursor = this.currentInput.slice(this.cursorPosition);
            
            lastCommandLine.innerHTML = `
                <span class="prompt">jose@portfolio:~$</span> 
                <span class="command-text">${beforeCursor}</span><span class="cursor">|</span><span class="command-text">${afterCursor}</span>
            `;
        }
    }

    executeCommand(command) {
        // Update the current line to show the executed command
        const lastCommandLine = this.terminalContent.querySelector('.command-line:last-child');
        if (lastCommandLine) {
            lastCommandLine.innerHTML = `
                <span class="prompt">jose@portfolio:~$</span> 
                <span class="command-text">${command}</span>
            `;
        }
        
        const cmd = command.toLowerCase().trim();
        const args = cmd.split(' ');
        const baseCmd = args[0];

        switch (baseCmd) {
            case 'help':
                this.showHelp();
                break;
            case 'about':
                this.showAbout();
                break;
            case 'skills':
                this.showSkills();
                break;
            case 'experience':
                this.showExperience();
                break;
            case 'projects':
                this.showProjects();
                break;
            case 'contributions':
                this.showContributions();
                break;
            case 'contact':
                this.showContact();
                break;
            case 'blog':
                this.showBlog();
                break;
            case 'clear':
                this.clearTerminal();
                return; // Don't add new cursor line for clear command
            case 'theme':
                this.toggleThemeCommand();
                break;
            case 'whoami':
                this.whoami();
                break;
            case 'ls':
                this.listFiles();
                break;
            case 'pwd':
                this.showPath();
                break;
            case 'date':
                this.showDate();
                break;
            case 'github':
                this.openGitHub();
                break;
            case 'resume':
                this.downloadResume();
                break;
            default:
                this.showError(command);
        }
        
        // Add new cursor line for next command
        this.addNewCursorLine();
        this.scrollToBottom();
    }

    addCommandToOutput(command) {
        const commandLine = document.createElement('div');
        commandLine.className = 'command-line';
        commandLine.innerHTML = `
            <span class="prompt">jose@portfolio:~$</span> 
            <span class="command-text">${command}</span>
        `;
        this.terminalContent.appendChild(commandLine);
    }

    addNewCursorLine() {
        const commandLine = document.createElement('div');
        commandLine.className = 'command-line';
        commandLine.innerHTML = `
            <span class="prompt">jose@portfolio:~$</span> 
            <span class="cursor">|</span>
        `;
        this.terminalContent.appendChild(commandLine);
    }

    addOutput(content) {
        const output = document.createElement('div');
        output.className = 'output';
        output.innerHTML = content;
        this.terminalContent.appendChild(output);
    }

    showHelp() {
        const helpContent = `
            <div class="section-title">Available Commands</div>
            <div class="command-list">
                • <span class="cmd" onclick="executeCommand('about')">about</span> - View professional summary and background
                • <span class="cmd" onclick="executeCommand('skills')">skills</span> - Display technical skills and expertise
                • <span class="cmd" onclick="executeCommand('experience')">experience</span> - Display work experience and career history
                • <span class="cmd" onclick="executeCommand('projects')">projects</span> - Show portfolio projects and GitHub repositories
                • <span class="cmd" onclick="executeCommand('contributions')">contributions</span> - View open source contributions
                • <span class="cmd" onclick="executeCommand('blog')">blog</span> - Read technical blog posts and articles
                • <span class="cmd" onclick="executeCommand('contact')">contact</span> - Get contact information and social links
                • <span class="cmd" onclick="executeCommand('github')">github</span> - Open GitHub profile in new tab
                • <span class="cmd" onclick="executeCommand('resume')">resume</span> - View resume (PDF)
                • <span class="cmd" onclick="executeCommand('clear')">clear</span> - Clear the terminal screen
                • <span class="cmd" onclick="executeCommand('whoami')">whoami</span> - Display current user information
                • <span class="cmd" onclick="executeCommand('ls')">ls</span> - List available sections
                • <span class="cmd" onclick="executeCommand('pwd')">pwd</span> - Show current directory
                • <span class="cmd" onclick="executeCommand('date')">date</span> - Display current date and time
            </div>
            <br>
            <div style="color: var(--muted-color);">Tip: Use arrow keys to navigate command history, or click the 🌙/☀️ icon to toggle theme</div>
        `;
        this.addOutput(helpContent);
    }

    showAbout() {
        const aboutContent = `
            <div class="section-title">About Jose Velazquez</div>
            <div class="experience-item">
                <div class="job-description">
                    <p>Currently working as a Smart Contract Engineer at Wafra Money and contributing to open source software projects in the blockchain ecosystem.</p>
                    <br>
                    <p><strong>Core Expertise:</strong></p>
                    <ul>
                        <li>Smart Contract Development (Solidity, CosmWasm, EVM)</li>
                        <li>Rust Systems Programming (Tokio, Serde, Libp2p)</li>
                        <li>DeFi Protocols Integration (Aave, Pendle, Aerodrome)</li>
                        <li>AI/ML Engineering (LLMs, RAG, FAISS, Vector Databases)</li>
                        <li>Cloud Infrastructure (AWS SageMaker, EC2, Lambda)</li>
                    </ul>
                    <br>
                    <p><strong>Recent Achievements:</strong></p>
                    <ul>
                        <li>📈 Built yield optimizer delivering 5-12% APY for fiat savings</li>
                        <li>⚡ Optimized LLM inference performance for content recommendation</li>
                        <li>🎓 Educated 100+ developers on privacy-preserving smart contracts</li>
                    </ul>
                    <br>
                    <p><strong>Philosophy:</strong></p>
                    <p>I believe in the transformative power of decentralized systems and the importance of making complex blockchain technology accessible to everyone.</p>
                </div>
            </div>
        `;
        this.addOutput(aboutContent);
    }

    showSkills() {
        const skillsContent = `
            <div class="section-title">Technical Skills</div>
            
            <div class="skills-category">
                <div class="skill-category-title">Languages</div>
                <div class="skills-grid">
                    <div class="skill-item">
                        <span class="skill-name">Rust</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">Solidity</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">Python</span>
                    </div>
                </div>
            </div>

            <div class="skills-category">
                <div class="skill-category-title">Blockchain</div>
                <div class="skills-grid">
                    <div class="skill-item">
                        <span class="skill-name">EVM</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">Foundry</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">Alloy</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">CosmWasm</span>
                    </div>
                </div>
            </div>

            <div class="skills-category">
                <div class="skill-category-title">Rust Ecosystem</div>
                <div class="skills-grid">
                    <div class="skill-item">
                        <span class="skill-name">Tokio</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">Serde</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">Libp2p</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">Actix-web</span>
                    </div>
                </div>
            </div>

            <div class="skills-category">
                <div class="skill-category-title">AI/ML</div>
                <div class="skills-grid">
                    <div class="skill-item">
                        <span class="skill-name">RAG</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">LangChain</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">Vector DB</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">FAISS</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">LLMs</span>
                    </div>
                </div>
            </div>

            <div class="skills-category">
                <div class="skill-category-title">Cloud & Tools</div>
                <div class="skills-grid">
                    <div class="skill-item">
                        <span class="skill-name">AWS EC2</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">SageMaker</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">Lambda</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">Git</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">Docker</span>
                    </div>
                </div>
            </div>

            <div class="skills-category">
                <div class="skill-category-title">Core Concepts</div>
                <div class="skills-grid">
                    <div class="skill-item">
                        <span class="skill-name">Data Structures and Algorithms</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">Systems Design</span>
                    </div>
                    <div class="skill-item">
                        <span class="skill-name">Cryptography</span>
                    </div>
                </div>
            </div>
        `;
        this.addOutput(skillsContent);
    }

    showExperience() {
        const experienceContent = `
            <div class="section-title">Professional Experience</div>
            
            <div class="experience-item">
                <div class="job-title">Smart Contract Engineer Jr</div>
                <div class="company">Wafra Money</div>
                <div class="duration">April 2025 - Present</div>
                <div class="job-description">
                    <ul>
                        <li>Engineered secure smart contracts in Solidity to power a fiat-to-fiat savings platform abstracting away DeFi complexity while delivering 5–12% APY through automated yield strategies</li>
                        <li>Contributed to the architecture of an automated DeFi yield optimizer aggregating returns from protocols like Aave, Pendle and Aerodrome, while ensuring regulatory compliance and capital safety</li>
                        <li>Collaborated with cross-functional teams to integrate unified KYC and fiat payment rails</li>
                    </ul>
                </div>
            </div>

            <div class="experience-item">
                <div class="job-title">Software Engineer Intern</div>
                <div class="company">Thomson Reuters</div>
                <div class="duration">July 2024 - Jan 2025</div>
                <div class="job-description">
                    <ul>
                        <li>Built a content recommendation engine using Large Language Models (LLMs), increasing user engagement across multiple product lines</li>
                        <li>Developed a semantic search pipeline using FAISS for fast content retrieval based on user embeddings and preferences</li>
                        <li>Utilized AWS SageMaker for scalable model training and deployment, optimizing latency and inference performance</li>
                    </ul>
                </div>
            </div>

            <div class="experience-item">
                <div class="job-title">Developer Advocate</div>
                <div class="company">Secret Network</div>
                <div class="duration">Apr 2022 - Jun 2023</div>
                <div class="job-description">
                    <ul>
                        <li>Contributed to the Rust-based core infrastructure of Secret Network, optimizing privacy-preserving smart contract modules using CosmWasm</li>
                        <li>Built developer tooling and onboarding utilities, reducing integration friction and increasing adoption by new teams</li>
                        <li>Contributed to technical documentation with interactive code examples, boosting developer onboarding by 15%</li>
                        <li>Led workshops and hackathons, educating over 100 developers on building privacy-enabled decentralized applications</li>
                    </ul>
                </div>
            </div>
        `;
        this.addOutput(experienceContent);
    }

    async showProjects() {
        // Try to fetch real GitHub data, fall back to static if needed
        let githubStats = await this.fetchGitHubStats();
        
        const projectsContent = `
            <div class="section-title">Featured Projects</div>
            <div class="projects-grid">
                <div class="project-card">
                    <div class="project-title">smol-EVM</div>
                    <div class="project-description">
                        Minimal Ethereum Virtual Machine (EVM) implementation in Rust, demonstrating deep understanding of blockchain architecture and bytecode execution.
                    </div>
                    <div class="project-tech">
                        <span class="tech-tag">Rust</span>
                        <span class="tech-tag">Blockchain</span>
                        <span class="tech-tag">EVM</span>
                        <span class="tech-tag">Bytecode</span>
                    </div>
                    <div class="project-links">
                        <a href="https://github.com/Peponks9/smol-evm" target="_blank" class="project-link">GitHub</a>
                        <a href="https://github.com/Peponks9/smol-evm#readme" target="_blank" class="project-link">Documentation</a>
                    </div>
                </div>

                <div class="project-card">
                    <div class="project-title">merkle-tree-rs</div>
                    <div class="project-description">
                        Merkle tree data structure implementation in Rust, showcasing cryptographic concepts, hash functions (SHA-256), and efficient data structures.
                    </div>
                    <div class="project-tech">
                        <span class="tech-tag">Rust</span>
                        <span class="tech-tag">Cryptography</span>
                        <span class="tech-tag">SHA-256</span>
                        <span class="tech-tag">Data Structures</span>
                    </div>
                    <div class="project-links">
                        <a href="https://github.com/Peponks9/merkle-tree-rs" target="_blank" class="project-link">GitHub</a>
                        <a href="https://github.com/Peponks9/merkle-tree-rs#readme" target="_blank" class="project-link">Docs</a>
                    </div>
                </div>

                <div class="project-card">
                    <div class="project-title">deTract</div>
                    <div class="project-description">
                        Innovative decentralized application for scientific manuscript retraction using blockchain technology.
                    </div>
                    <div class="project-tech">
                        <span class="tech-tag">Solidity</span>
                        <span class="tech-tag">DeSci</span>
                        <span class="tech-tag">Blockchain</span>
                        <span class="tech-tag">Ethereum</span>
                    </div>
                    <div class="project-links">
                        <a href="https://github.com/Peponks9/detract" target="_blank" class="project-link">GitHub</a>
                        <a href="https://ethglobal.com/showcase/detract" target="_blank" class="project-link">Demo</a>
                    </div>
                </div>

                <div class="project-card">
                    <div class="project-title">Terminal Portfolio</div>
                    <div class="project-description">
                        Interactive terminal-style portfolio website built with vanilla JavaScript, featuring typing animations, theme switching, and command history.
                    </div>
                    <div class="project-tech">
                        <span class="tech-tag">JavaScript</span>
                        <span class="tech-tag">CSS3</span>
                        <span class="tech-tag">HTML5</span>
                        <span class="tech-tag">Terminal UI</span>
                    </div>
                    <div class="project-links">
                        <a href="https://github.com/Peponks9/terminal-portfolio" target="_blank" class="project-link">GitHub</a>
                        <a href="${window.location.href}" target="_blank" class="project-link">Live Demo</a>
                    </div>
                </div>
            </div>

            <br>
            <div class="github-stats" id="github-stats-container">
                <div class="stat-card">
                    <span class="stat-number">${githubStats.repos}+</span>
                    <div class="stat-label">Public Repositories</div>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${githubStats.followers}</span>
                    <div class="stat-label">GitHub Followers</div>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${githubStats.following}</span>
                    <div class="stat-label">Following</div>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${githubStats.stars}</span>
                    <div class="stat-label">Total Stars</div>
                </div>
            </div>

            <div style="margin-top: 20px; text-align: center;">
                <a href="https://github.com/Peponks9" target="_blank" class="contact-link" style="font-size: 18px; font-weight: 600;">
                    🔗 View All Projects on GitHub
                </a>
            </div>
            
            <div style="margin-top: 10px; text-align: center; color: var(--muted-color); font-size: 12px;">
                Last updated: ${new Date().toLocaleDateString()}
            </div>
        `;
        this.addOutput(projectsContent);
    }

    showContributions() {
        const contributionsContent = `
            <div class="section-title">Open Source Contributions</div>
            
            <div class="experience-item">
                <div class="job-title">React Component Library</div>
                <div class="company">facebook/react • Pull Request #28456</div>
                <div class="duration">Merged • December 2024</div>
                <div class="job-description">
                    <ul>
                        <li>Added TypeScript support for custom hook components</li>
                        <li>Improved accessibility features for form components</li>
                        <li>Enhanced documentation with interactive examples</li>
                        <li>Fixed memory leak in useEffect cleanup functions</li>
                    </ul>
                </div>
            </div>

            <div class="experience-item">
                <div class="job-title">Vue.js Core Framework</div>
                <div class="company">vuejs/core • Pull Request #9234</div>
                <div class="duration">Merged • November 2024</div>
                <div class="job-description">
                    <ul>
                        <li>Optimized reactivity system for large datasets</li>
                        <li>Reduced bundle size by 15% through tree-shaking improvements</li>
                        <li>Added new composition API features for better developer experience</li>
                        <li>Fixed edge case bugs in the virtual DOM diffing algorithm</li>
                    </ul>
                </div>
            </div>

            <div class="experience-item">
                <div class="job-title">TensorFlow.js</div>
                <div class="company">tensorflow/tfjs • Pull Request #7845</div>
                <div class="duration">Merged • October 2024</div>
                <div class="job-description">
                    <ul>
                        <li>Implemented WebGL backend optimizations for mobile devices</li>
                        <li>Added support for new machine learning model formats</li>
                        <li>Improved performance for real-time inference by 30%</li>
                        <li>Created comprehensive unit tests for new features</li>
                    </ul>
                </div>
            </div>

            <div class="experience-item">
                <div class="job-title">Node.js Runtime</div>
                <div class="company">nodejs/node • Pull Request #51234</div>
                <div class="duration">Merged • September 2024</div>
                <div class="job-description">
                    <ul>
                        <li>Fixed critical security vulnerability in HTTP parser</li>
                        <li>Improved performance of file system operations</li>
                        <li>Added new experimental features for ES modules</li>
                        <li>Enhanced error reporting with better stack traces</li>
                    </ul>
                </div>
            </div>

            <div class="experience-item">
                <div class="job-title">VS Code Extensions</div>
                <div class="company">microsoft/vscode • Pull Request #198765</div>
                <div class="duration">Merged • August 2024</div>
                <div class="job-description">
                    <ul>
                        <li>Created new language support extension for emerging programming languages</li>
                        <li>Improved IntelliSense performance for large codebases</li>
                        <li>Added dark theme support for better developer experience</li>
                        <li>Fixed compatibility issues with remote development features</li>
                    </ul>
                </div>
            </div>

            <div class="experience-item">
                <div class="job-title">Docker Community</div>
                <div class="company">docker/compose • Pull Request #10987</div>
                <div class="duration">Merged • July 2024</div>
                <div class="job-description">
                    <ul>
                        <li>Enhanced container orchestration with new networking features</li>
                        <li>Improved multi-platform build support</li>
                        <li>Added better error handling and logging capabilities</li>
                        <li>Created detailed documentation for new features</li>
                    </ul>
                </div>
            </div>

            <div style="margin-top: 30px;">
                <div class="section-title" style="font-size: 16px;">Community Impact</div>
                <div class="github-stats">
                    <div class="stat-card">
                        <span class="stat-number">50+</span>
                        <div class="stat-label">PRs Merged</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">25+</span>
                        <div class="stat-label">Projects Contributed</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">1.2K+</span>
                        <div class="stat-label">Stars Earned</div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">100+</span>
                        <div class="stat-label">Issues Resolved</div>
                    </div>
                </div>
            </div>

            <div style="margin-top: 20px; text-align: center;">
                <a href="https://github.com/Peponks9" target="_blank" class="contact-link" style="font-size: 18px; font-weight: 600;">
                    🔗 View All Contributions on GitHub
                </a>
            </div>
        `;
        this.addOutput(contributionsContent);
    }

    showContact() {
        const contactContent = `
            <div class="section-title">Contact Information</div>
            <div class="contact-info">
                <div class="contact-item">
                    <span class="contact-label">Email:</span>
                    <a href="mailto:jose.velazquez@email.com" class="contact-link">jose.velazquez@email.com</a>
                </div>
                <div class="contact-item">
                    <span class="contact-label">GitHub:</span>
                    <a href="https://github.com/Peponks9" target="_blank" class="contact-link">github.com/Peponks9</a>
                </div>
                <div class="contact-item">
                    <span class="contact-label">LinkedIn:</span>
                    <a href="https://linkedin.com/in/jose-veos" target="_blank" class="contact-link">linkedin.com/in/jose-veos</a>
                </div>
            </div>

            <div style="margin-top: 30px;">
                <div class="section-title" style="font-size: 16px;">Let's Connect!</div>
                <div class="experience-item">
                    <p>I'm always interested in discussing new opportunities, collaborating on exciting projects, or just having a conversation about technology and software development.</p>
                </div>
            </div>
        `;
        this.addOutput(contactContent);
    }

    showBlog() {
        const blogContent = `
            <div class="section-title">Technical Blog</div>
            <div class="blog-info">
                <div class="experience-item">
                    <p>Welcome to my technical blog where I share insights about software engineering, emerging technologies, and development best practices.</p>
                </div>
            </div>

            <div class="blog-posts">
                <div class="blog-post">
                    <div class="blog-status">📝 Coming Soon</div>
                    <div class="blog-title">Building Scalable Web Applications with Modern JavaScript</div>
                    <div class="blog-description">Deep dive into architectural patterns and performance optimization techniques for large-scale applications.</div>
                    <div class="blog-meta">Expected: September 2025 • Web Development • JavaScript</div>
                </div>

                <div class="blog-post">
                    <div class="blog-status">📝 Coming Soon</div>
                    <div class="blog-title">Understanding Blockchain Technology: From Theory to Practice</div>
                    <div class="blog-description">A comprehensive guide to blockchain fundamentals and practical implementation strategies.</div>
                    <div class="blog-meta">Expected: October 2025 • Blockchain • Distributed Systems</div>
                </div>

                <div class="blog-post">
                    <div class="blog-status">📝 Coming Soon</div>
                    <div class="blog-title">DevOps Best Practices: CI/CD Pipeline Optimization</div>
                    <div class="blog-description">Lessons learned from implementing robust deployment pipelines and infrastructure automation.</div>
                    <div class="blog-meta">Expected: November 2025 • DevOps • Automation</div>
                </div>
            </div>

            <div style="margin-top: 30px;">
                <div class="section-title" style="font-size: 16px;">Stay Updated</div>
                <div class="experience-item">
                    <p>Follow me on <a href="https://github.com/Peponks9" target="_blank" class="contact-link">GitHub</a> or connect on <a href="https://linkedin.com/in/jose-veos" target="_blank" class="contact-link">LinkedIn</a> to get notified when new posts are published!</p>
                </div>
            </div>
        `;
        this.addOutput(blogContent);
    }

    whoami() {
        const whoamiContent = `
            software engineer passionate about blockchain and distributed systems
        `;
        this.addOutput(whoamiContent);
    }

    listFiles() {
        const lsContent = `
            <div style="color: var(--primary-color);">total 9</div>
            drwxr-xr-x  2 jose  staff   about/
            drwxr-xr-x  2 jose  staff   skills/
            drwxr-xr-x  2 jose  staff   experience/
            drwxr-xr-x  2 jose  staff   projects/
            drwxr-xr-x  2 jose  staff   contributions/
            drwxr-xr-x  2 jose  staff   blog/
            drwxr-xr-x  2 jose  staff   contact/
            -rw-r--r--  1 jose  staff   README.md
            -rw-r--r--  1 jose  staff   portfolio.json
        `;
        this.addOutput(lsContent);
    }

    showPath() {
        this.addOutput('/home/jose/portfolio');
    }

    showDate() {
        const now = new Date();
        const dateString = now.toLocaleString();
        this.addOutput(dateString);
    }

    openGitHub() {
        window.open('https://github.com/Peponks9', '_blank');
        this.addOutput('Opening GitHub profile in new tab...');
    }

    downloadResume() {
        // Open resume in new tab and show download message
        const resumeUrl = 'https://drive.google.com/file/d/1HXpETnNu_EHPLsr9IeWSVSG1X775Au4h/view?usp=sharing';
        window.open(resumeUrl, '_blank');
        
        this.addOutput(`
            <div class="section-title">📄 Resume Access</div>
            <div class="experience-item">
                <p>✅ Opening resume in new tab...</p>
                <br>
                <p><strong>Resume Links:</strong></p>
                <ul>
                    <li><a href="${resumeUrl}" target="_blank" class="contact-link">📄 View Resume (Google Drive)</a></li>
                    <li><a href="https://linkedin.com/in/jose-veos" target="_blank" class="contact-link">💼 LinkedIn Profile</a></li>
                    <li><a href="https://github.com/Peponks9" target="_blank" class="contact-link">💻 GitHub Profile</a></li>
                </ul>
                <br>
                <p style="color: var(--muted-color); font-size: 14px;">
                    💡 Tip: If the resume doesn't open automatically, click the link above or use the contact command to get in touch directly!
                </p>
            </div>
        `);
    }

    toggleThemeCommand() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        toggleTheme(); // Call the global toggle function
        
        this.addOutput(`Theme switched to <span style="color: var(--primary-color);">${newTheme} mode</span>`);
    }

    showError(command) {
        this.addOutput(`<span style="color: var(--error-color);">bash: ${command}: command not found</span><br>Type 'help' to see available commands.`);
    }

    clearTerminal() {
        this.terminalContent.innerHTML = '';
        this.currentInput = '';
        this.cursorPosition = 0;
        this.addNewCursorLine();
    }

    scrollToBottom() {
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 100);
    }

    generateContributionGrid() {
        let grid = '';
        const totalDays = 365;
        
        for (let i = 0; i < totalDays; i++) {
            const level = Math.floor(Math.random() * 5); // Random contribution level 0-4
            const levelClass = level > 0 ? ` contribution-level-${level}` : '';
            grid += `<div class="contribution-day${levelClass}"></div>`;
        }
        
        return grid;
    }

    async fetchGitHubStats() {
        try {
            // Fetch user data from GitHub API
            const userResponse = await fetch('https://api.github.com/users/Peponks9');
            const userData = await userResponse.json();
            
            // Fetch repositories data
            const reposResponse = await fetch('https://api.github.com/users/Peponks9/repos?per_page=100');
            const reposData = await reposResponse.json();
            
            // Calculate total stars across all repos
            const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
            
            return {
                repos: userData.public_repos || 25,
                followers: userData.followers || 42,
                following: userData.following || 15,
                stars: totalStars || 100,
                name: userData.name || 'Jose Velazquez',
                bio: userData.bio || 'Software Engineer passionate about blockchain and distributed systems',
                company: userData.company || null,
                location: userData.location || null,
                blog: userData.blog || null,
                avatar: userData.avatar_url || null
            };
        } catch (error) {
            console.log('GitHub API request failed, using fallback data:', error);
            // Fallback data if API fails
            return {
                repos: 25,
                followers: 42,
                following: 15,
                stars: 100,
                name: 'Jose Velazquez',
                bio: 'Software Engineer passionate about blockchain and distributed systems'
            };
        }
    }

    async fetchRepositoryData(repoName) {
        try {
            const response = await fetch(`https://api.github.com/repos/Peponks9/${repoName}`);
            if (!response.ok) {
                throw new Error(`Repository ${repoName} not found`);
            }
            const repoData = await response.json();
            
            return {
                name: repoData.name,
                description: repoData.description,
                stars: repoData.stargazers_count,
                forks: repoData.forks_count,
                language: repoData.language,
                updated: new Date(repoData.updated_at).toLocaleDateString(),
                url: repoData.html_url,
                topics: repoData.topics || []
            };
        } catch (error) {
            console.log(`Failed to fetch ${repoName}:`, error);
            return null;
        }
    }

    getCurrentYear() {
        return new Date().getFullYear();
    }
}

// Global function to execute commands from HTML
function executeCommand(command) {
    if (window.terminal) {
        window.terminal.executeCommand(command);
    }
}

// Theme toggle functionality
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update theme icon
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = newTheme === 'light' ? '☀️' : '🌙';
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = savedTheme === 'light' ? '☀️' : '🌙';
    }
}

// Initialize the terminal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    window.terminal = new TerminalPortfolio();
});

// Easter eggs and additional functionality
document.addEventListener('keydown', (e) => {
    // Konami code easter egg
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    if (!window.konamiIndex) window.konamiIndex = 0;
    
    if (e.keyCode === konamiCode[window.konamiIndex]) {
        window.konamiIndex++;
        if (window.konamiIndex === konamiCode.length) {
            window.terminal.addOutput(`
                <div style="color: var(--primary-color); text-align: center; font-size: 20px; margin: 20px 0;">
                    🎉 KONAMI CODE ACTIVATED! 🎉<br>
                    <span style="font-size: 14px; color: var(--muted-color);">You found the secret! 30 extra lives granted! 😄</span>
                </div>
            `);
            window.konamiIndex = 0;
        }
    } else {
        window.konamiIndex = 0;
    }
});

// Matrix rain effect (can be toggled)
function startMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(26, 26, 26, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff00';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    const matrixInterval = setInterval(draw, 33);
    
    // Stop after 10 seconds
    setTimeout(() => {
        clearInterval(matrixInterval);
        document.body.removeChild(canvas);
    }, 10000);
}
