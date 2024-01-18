const fs = require('fs');
const seedrandom = require('seedrandom');

class SimulationFeuForet {
    constructor(configFile) {
        this.random = seedrandom(); // Initialize the random number generator
        this.chargerConfiguration(configFile);
        this.initialiserGrille();
        this.propagerFeu();
    }

    chargerConfiguration(configFile) {
        try {
            const fileContent = fs.readFileSync(configFile, 'utf8');
            const lines = fileContent.split('\n');

            this.hauteur = parseInt(lines[0].split(":")[1].trim());
            this.largeur = parseInt(lines[1].split(":")[1].trim());
            this.probabilitePropagation = parseFloat(lines[2].split(":")[1].trim());

            this.grille = new Array(this.hauteur).fill().map(() => new Array(this.largeur).fill(' '));
            this.etatPrecedent = new Array(this.hauteur).fill().map(() => new Array(this.largeur).fill(' '));

            const positionsFeu = lines[3].split(":")[1].trim().split(",");
            for (const position of positionsFeu) {
                const coords = position.split("-");
                const x = parseInt(coords[0].trim());
                const y = parseInt(coords[1].trim());
                this.grille[x][y] = 'F';
            }
        } catch (error) {
            console.error(error);
        }
    }

    initialiserGrille() {
        console.log("État initial de la grille:");
        for (let i = 0; i < this.hauteur; i++) {
            for (let j = 0; j < this.largeur; j++) {
                process.stdout.write((this.grille[i][j] === 'F') ? "F " : ". ");
                this.etatPrecedent[i][j] = this.grille[i][j];
            }
            console.log();
        }
        console.log();
    }

    propagerFeu() {
        let etape = 0;

        while (this.SiResteFeu()) {
            console.log("Étape " + etape + ":");
            for (let i = 0; i < this.hauteur; i++) {
                for (let j = 0; j < this.largeur; j++) {
                    if (this.etatPrecedent[i][j] === 'F') {
                        this.grille[i][j] = 'X'; // La case s'éteint à l'étape t+1

                        // Propagation du feu aux cases adjacentes à l'étape t+1
                        this.propagerAuVoisinage(i - 1, j);
                        this.propagerAuVoisinage(i + 1, j);
                        this.propagerAuVoisinage(i, j - 1);
                        this.propagerAuVoisinage(i, j + 1);
                    }
                }
            }
            this.afficherGrille();
            this.copierGrille(this.grille, this.etatPrecedent); // Copier l'état actuel dans l'état précédent
            etape++;
        }

        console.log("La simulation est terminée après " + etape + " étapes.");
    }

    afficherGrille() {
        for (let i = 0; i < this.hauteur; i++) {
            for (let j = 0; j < this.largeur; j++) {
                process.stdout.write((this.grille[i][j] === 'F') ? "F " : (this.grille[i][j] === 'X') ? "X " : ". ");
            }
            console.log();
        }
        console.log();
    }

    propagerAuVoisinage(x, y) {
        if (
            x >= 0 &&
            x < this.hauteur &&
            y >= 0 &&
            y < this.largeur &&
            this.etatPrecedent[x][y] !== 'F' &&
            this.grille[x][y] !== 'X' &&
            this.etatPrecedent[x][y] !== 'X' &&
            this.random() < this.probabilitePropagation
        ) {
            this.grille[x][y] = 'F'; // La case devient en feu à l'étape t+1
        }
    }

    SiResteFeu() {
        for (let i = 0; i < this.hauteur; i++) {
            for (let j = 0; j < this.largeur; j++) {
                if (this.grille[i][j] === 'F') {
                    return true;
                }
            }
        }
        return false;
    }

    copierGrille(source, destination) {
        for (let i = 0; i < this.hauteur; i++) {
            destination[i] = source[i].slice();
        }
    }
}

const simulation = new SimulationFeuForet("config.txt");