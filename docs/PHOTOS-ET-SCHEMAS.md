# Photos et schémas des fiches sport

Les fiches « Comprendre le sport » (`/sports/<sport>/`) ont des cadres photo et des schémas de terrain.
Les deux se gèrent **en déposant des fichiers dans le dépôt** : aucun code à modifier.
Une fois le fichier sur `main`, Lovable récupère la modification ; il reste à **publier** dans Lovable pour la mettre en ligne.

## 1. Ajouter des photos

### Où et sous quel nom

Une photo = un fichier, rangé dans `src/assets/sport-photos/<dossier>/<emplacement>.jpg`.

- `<dossier>` : l'identifiant du sport (ex. `rugby`) ou de la discipline (ex. `rugby--competition-a-xv`). La liste complète est en bas de cette page.
- `<emplacement>` : le cadre à remplir, voir le tableau ci-dessous.
- Formats acceptés : `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.

| Emplacement | Où sur la fiche | Sujet conseillé | Format conseillé |
| --- | --- | --- | --- |
| `principe` | À côté du « principe en 30 secondes » | Une situation de jeu typique | 4:3, 1600 × 1200 px |
| `galerie-1` | Grande photo de gauche de la galerie | Une séance d'entraînement | 4:3, 1600 × 1200 px |
| `galerie-2` | Galerie, en haut à droite | Un moment de compétition | 2:1, 1600 × 800 px |
| `galerie-3` | Galerie, en bas à droite | La vie du club (vestiaire, podium…) | 2:1, 1600 × 800 px |
| `materiel` | À côté de « Matériel et tenue » | Le matériel posé à plat | 4:3, 1600 × 1200 px |

Les fiches **discipline** n'ont qu'un emplacement : `principe`.

Exemples :

```
src/assets/sport-photos/rugby/principe.jpg
src/assets/sport-photos/rugby/galerie-1.webp
src/assets/sport-photos/judo-jujitsu/materiel.jpg
src/assets/sport-photos/rugby--competition-a-xv/principe.jpg
```

Tant qu'un emplacement n'a pas de photo, le cadre décoratif aux couleurs de la marque reste affiché. On peut donc remplir les fiches petit à petit.

### Règles pour les fichiers

- **Moins de 500 Ko par photo** (idéalement 200 à 300 Ko). Pour réduire une photo : [squoosh.app](https://squoosh.app), export en WebP qualité 75.
- La photo est recadrée pour remplir le cadre : garde le sujet **au centre**.
- Le texte alternatif (lu par les lecteurs d'écran) est généré tout seul, par exemple « Rugby : une situation de jeu typique ».
- Utilise uniquement des photos dont Athlace a les droits (photos du club avec accord, banque d'images sous licence…).

### Déposer les photos depuis GitHub (sans rien installer)

1. Sur ton ordinateur, crée un dossier qui porte le nom exact du sport (ex. `rugby`) et mets-y les photos renommées (ex. `principe.jpg`).
2. Sur GitHub, ouvre `src/assets/sport-photos/`, puis **Add file → Upload files**.
3. Glisse le **dossier** entier dans la page : GitHub garde le nom du dossier.
4. En bas, choisis **Commit directly to the main branch** (ou crée une branche si tu veux relire avant), puis **Commit changes**.
5. Dans Lovable, publie.

Pour **remplacer** une photo, dépose un fichier avec le même nom au même endroit. Pour la **retirer**, ouvre le fichier sur GitHub, menu **⋯ → Delete file**.

Un test automatique (`npm test`) signale les dossiers ou emplacements mal nommés et les photos trop lourdes.

## 2. Modifier les schémas

Chaque schéma est en deux morceaux :

- **le dessin** : `src/assets/sport-schemas/<clé>.svg` (ex. `rugby.svg`) ;
- **le titre et la légende** : `src/data/sport-schemas.ts`. La légende suit l'ordre des repères numérotés ①②③ du dessin.

### Retoucher un dessin

1. Sur GitHub, ouvre le fichier `.svg`, puis l'icône **Download raw file**.
2. Ouvre-le dans Figma (glisser le fichier dans un projet), Illustrator, Inkscape (gratuit) ou un éditeur de texte.
3. Modifie, puis exporte en **SVG** en gardant **exactement le même nom de fichier**.
4. Sur GitHub, dans `src/assets/sport-schemas/`, **Add file → Upload files**, dépose le fichier (il remplace l'ancien), puis **Commit changes**.

Les couleurs de la charte sont écrites en clair dans les fichiers : `#415CAF` (bleu), `#0F172A` (nuit), `#F2EFE6` (crème), `#D5DE5B` (lime), `#FFFFFF` (blanc). Sur le site, elles sont automatiquement remplacées par les couleurs officielles du thème : garde ces valeurs pour rester dans la charte. Les autres couleurs (bois, gazon, cibles…) s'affichent telles quelles.

### Changer le titre ou la légende

Sur GitHub, ouvre `src/data/sport-schemas.ts`, clique sur le crayon (**Edit this file**), modifie le texte entre guillemets, puis **Commit changes**. Si tu ajoutes ou retires un repère numéroté dans le dessin, ajoute ou retire la ligne de légende correspondante.

### Changer de schéma, ou en créer un nouveau

- Le schéma affiché par un sport est indiqué par le champ `"schema"` de ce sport dans `src/data/sport-guides.ts` (ex. `"schema": "tatami"`). Mets `null` pour ne pas afficher de schéma.
- Pour un nouveau schéma : dépose `src/assets/sport-schemas/<nouvelle-clé>.svg`, ajoute son titre et sa légende dans `src/data/sport-schemas.ts`, puis mets `"schema": "<nouvelle-clé>"` sur le sport.

## 3. Plus tard : dépôt depuis l'interface Athlace

Déposer les photos directement depuis l'administration du site est possible : il faut un espace de stockage Supabase dédié, une table qui associe chaque photo à son emplacement, et un onglet « Photos des fiches » dans `/admin`. Les photos seraient alors en ligne sans passer par GitHub ni republier. Ce n'est pas encore fait.

## Identifiants des dossiers

| Sport | Dossier photos | Schéma |
| --- | --- | --- |
| Football | `football` | `foot.svg` |
| Football américain | `football-americain` | `fa.svg` |
| Rugby | `rugby` | `rugby.svg` |
| Rugby à XIII | `rugby-a-xiii` | `rugby.svg` |
| Basketball | `basketball` | `basket.svg` |
| Handball | `handball` | `hand.svg` |
| Volley | `volley` | `volley.svg` |
| Hockey sur gazon | `hockey-sur-gazon` | `hockey.svg` |
| Hockey sur glace | `hockey-sur-glace` | `rink.svg` |
| Baseball, softball | `baseball-softball` | `baseball.svg` |
| Ultimate et disc | `ultimate-et-disc` | `ultimate.svg` |
| Polo | `polo` | - |
| Tennis | `tennis` | `tennis.svg` |
| Badminton | `badminton` | `bad.svg` |
| Tennis de table | `tennis-de-table` | `tt.svg` |
| Squash | `squash` | `squash.svg` |
| Natation | `natation` | `pool.svg` |
| Plongée et sports sous-marins | `plongee-et-sports-sous-marins` | - |
| Chasse sous-marine | `chasse-sous-marine` | - |
| Voile | `voile` | `voile.svg` |
| Aviron | `aviron` | `rowing.svg` |
| Canoë-kayak | `canoe-kayak` | `slalomwater.svg` |
| Surf | `surf` | - |
| Ski nautique et wakeboard | `ski-nautique-et-wakeboard` | - |
| Motonautique | `motonautique` | - |
| Sauvetage et secourisme | `sauvetage-et-secourisme` | `pool.svg` |
| Judo-jujitsu | `judo-jujitsu` | `tatami.svg` |
| Karaté | `karate` | `tatami.svg` |
| Taekwondo | `taekwondo` | `octagon.svg` |
| Aïkido | `aikido` | `tatami.svg` |
| Arts martiaux chinois | `arts-martiaux-chinois` | `tatami.svg` |
| Boxe anglaise | `boxe-anglaise` | `ring.svg` |
| Savate boxe française | `savate-boxe-francaise` | `ring.svg` |
| Kick-boxing, muay thaï | `kick-boxing-muay-thai` | `ring.svg` |
| Boxe américaine | `boxe-americaine` | `ring.svg` |
| Lutte | `lutte` | `wrestle.svg` |
| Escrime | `escrime` | `piste.svg` |
| Athlétisme | `athletisme` | `track.svg` |
| Triathlon | `triathlon` | `flow3.svg` |
| Pentathlon moderne | `pentathlon-moderne` | `flow5.svg` |
| Course d'orientation | `course-d-orientation` | `orient.svg` |
| Randonnée pédestre | `randonnee-pedestre` | - |
| Escalade | `escalade` | `climb.svg` |
| Alpinisme et montagne | `alpinisme-et-montagne` | - |
| Spéléologie | `speleologie` | - |
| Cyclisme | `cyclisme` | - |
| Cyclotourisme | `cyclotourisme` | - |
| Équitation | `equitation` | - |
| Golf | `golf` | `golf.svg` |
| Sports canins et traîneau | `sports-canins-et-traineau` | - |
| Pêche sportive | `peche-sportive` | - |
| Ski | `ski` | `slalom.svg` |
| Sports de glace | `sports-de-glace` | - |
| Roller et skateboard | `roller-et-skateboard` | - |
| Char à voile | `char-a-voile` | - |
| Gymnastique | `gymnastique` | - |
| Danse | `danse` | - |
| Haltérophilie, musculation et force | `halterophilie-musculation-et-force` | - |
| Twirling bâton | `twirling-baton` | - |
| Double dutch | `double-dutch` | - |
| Sport automobile | `sport-automobile` | - |
| Motocyclisme | `motocyclisme` | - |
| Voitures radiocommandées | `voitures-radiocommandees` | - |
| Aéromodélisme | `aeromodelisme` | - |
| Parachutisme | `parachutisme` | `para.svg` |
| Vol en planeur | `vol-en-planeur` | - |
| Vol libre | `vol-libre` | - |
| ULM | `ulm` | - |
| Aviation | `aviation` | - |
| Hélicoptère | `helicoptere` | - |
| Aérostation | `aerostation` | - |
| Tir sportif | `tir-sportif` | `shoot.svg` |
| Tir à l'arc | `tir-a-l-arc` | `archery.svg` |
| Ball-trap | `ball-trap` | - |
| Javelot tir sur cible | `javelot-tir-sur-cible` | `javelot.svg` |
| Billard | `billard` | `billiard.svg` |
| Bowling et quilles | `bowling-et-quilles` | `bowling.svg` |
| Pétanque et jeu provençal | `petanque-et-jeu-provencal` | `petanque.svg` |
| Sport boules | `sport-boules` | `petanque.svg` |
| Échecs | `echecs` | `chess.svg` |
| Pelote basque | `pelote-basque` | `fronton.svg` |
| Longue paume | `longue-paume` | `gagne.svg` |
| Balle au tambourin | `balle-au-tambourin` | - |
| Ballon au poing | `ballon-au-poing` | `gagne.svg` |
| Course camarguaise | `course-camarguaise` | - |
| Course landaise | `course-landaise` | - |
| Joute et sauvetage nautique | `joute-et-sauvetage-nautique` | - |
| Handisport | `handisport` | - |
| Sport adapté | `sport-adapte` | - |

### Disciplines

| Discipline | Dossier photos |
| --- | --- |
| Rugby · Compétition à XV | `rugby--competition-a-xv` |
| Rugby · Compétition à X | `rugby--competition-a-x` |
| Rugby · Compétition à 7 | `rugby--competition-a-7` |
| Rugby · Rugby à 5 Loisir - Bien être | `rugby--rugby-a-5-loisir-bien-etre` |
| Rugby · Rugby Loisir avec plaquage | `rugby--rugby-loisir-avec-plaquage` |
| Rugby · Rugby Santé | `rugby--rugby-sante` |
| Rugby · Beach | `rugby--beach` |
| Rugby · Rugby Entreprises | `rugby--rugby-entreprises` |
| Handball · Handball à 7 | `handball--handball-a-7` |
| Handball · Hand à 4 | `handball--hand-a-4` |
| Handball · HandFit | `handball--handfit` |
| Handball · Beach Handball | `handball--beach-handball` |
| Plongée et sports sous-marins · Plongée sous-marine | `plongee-et-sports-sous-marins--plongee-sous-marine` |
| Plongée et sports sous-marins · Rando Sub | `plongee-et-sports-sous-marins--rando-sub` |
| Plongée et sports sous-marins · Apnée | `plongee-et-sports-sous-marins--apnee` |
| Plongée et sports sous-marins · Plongée Nitrox | `plongee-et-sports-sous-marins--plongee-nitrox` |
| Plongée et sports sous-marins · Environnement et Bio | `plongee-et-sports-sous-marins--environnement-et-bio` |
| Plongée et sports sous-marins · Nage avec palmes | `plongee-et-sports-sous-marins--nage-avec-palmes` |
| Plongée et sports sous-marins · Photo et Vidéo | `plongee-et-sports-sous-marins--photo-et-video` |
| Plongée et sports sous-marins · Plongée recycleur | `plongee-et-sports-sous-marins--plongee-recycleur` |
| Plongée et sports sous-marins · Nage en eau vive | `plongee-et-sports-sous-marins--nage-en-eau-vive` |
| Plongée et sports sous-marins · Plongée Trimix | `plongee-et-sports-sous-marins--plongee-trimix` |
| Plongée et sports sous-marins · Orientation | `plongee-et-sports-sous-marins--orientation` |
| Plongée et sports sous-marins · Pêche sous-marine | `plongee-et-sports-sous-marins--peche-sous-marine` |
| Plongée et sports sous-marins · Tir sur cible | `plongee-et-sports-sous-marins--tir-sur-cible` |
| Plongée et sports sous-marins · Hockey | `plongee-et-sports-sous-marins--hockey` |
| Plongée et sports sous-marins · Plongée souterraine | `plongee-et-sports-sous-marins--plongee-souterraine` |
| Plongée et sports sous-marins · Archéologie | `plongee-et-sports-sous-marins--archeologie` |
| Plongée et sports sous-marins · Sirènes & Tritons | `plongee-et-sports-sous-marins--sirenes-tritons` |
| Sauvetage et secourisme · Secourisme Opérationnel | `sauvetage-et-secourisme--secourisme-operationnel` |
| Sauvetage et secourisme · Sauvetage Sportif | `sauvetage-et-secourisme--sauvetage-sportif` |
| Judo-jujitsu · Judo | `judo-jujitsu--judo` |
| Judo-jujitsu · Taïso | `judo-jujitsu--taiso` |
| Judo-jujitsu · Jujitsu | `judo-jujitsu--jujitsu` |
| Judo-jujitsu · Kendo | `judo-jujitsu--kendo` |
| Judo-jujitsu · Self-défense | `judo-jujitsu--self-defense` |
| Judo-jujitsu · Kata | `judo-jujitsu--kata` |
| Judo-jujitsu · Iaido | `judo-jujitsu--iaido` |
| Judo-jujitsu · Ne-Waza | `judo-jujitsu--ne-waza` |
| Judo-jujitsu · Kyudo | `judo-jujitsu--kyudo` |
| Judo-jujitsu · Sport chanbara | `judo-jujitsu--sport-chanbara` |
| Judo-jujitsu · Jodo | `judo-jujitsu--jodo` |
| Judo-jujitsu · Jiu-jitsu brésilien | `judo-jujitsu--jiu-jitsu-bresilien` |
| Judo-jujitsu · Naginata | `judo-jujitsu--naginata` |
| Taekwondo · Body Taekwondo | `taekwondo--body-taekwondo` |
| Taekwondo · Taekwondo Impact | `taekwondo--taekwondo-impact` |
| Taekwondo · Taekwonkido | `taekwondo--taekwonkido` |
| Taekwondo · Hoshin Moosool | `taekwondo--hoshin-moosool` |
| Boxe anglaise · Boxe anglaise | `boxe-anglaise--boxe-anglaise` |
| Lutte · Lutte | `lutte--lutte` |
| Lutte · Grappling | `lutte--grappling` |
| Lutte · Sambo | `lutte--sambo` |
| Randonnée pédestre · Randonnée pédestre | `randonnee-pedestre--randonnee-pedestre` |
| Randonnée pédestre · Raquette à neige | `randonnee-pedestre--raquette-a-neige` |
| Randonnée pédestre · Marche nordique | `randonnee-pedestre--marche-nordique` |
| Randonnée pédestre · Longe Côte - Marche Aquatique | `randonnee-pedestre--longe-cote-marche-aquatique` |
| Randonnée pédestre · Cyclotourisme | `randonnee-pedestre--cyclotourisme` |
| Randonnée pédestre · Marche d'Endurance | `randonnee-pedestre--marche-d-endurance` |
| Randonnée pédestre · Ski de fond | `randonnee-pedestre--ski-de-fond` |
| Randonnée pédestre · Ski de randonnée (ou ski alpinisme) | `randonnee-pedestre--ski-de-randonnee-ou-ski-alpinisme` |
| Randonnée pédestre · Géocaching (caches et GPS) ou Randocaching® | `randonnee-pedestre--geocaching-caches-et-gps-ou-randocaching` |
| Randonnée pédestre · Alpinisme | `randonnee-pedestre--alpinisme` |
| Ski · Ski Alpin | `ski--ski-alpin` |
| Ski · Snowboard | `ski--snowboard` |
| Ski · Ski de Fond | `ski--ski-de-fond` |
| Ski · Ski de Randonnée | `ski--ski-de-randonnee` |
| Ski · Biathlon | `ski--biathlon` |
| Ski · Rollerski | `ski--rollerski` |
| Ski · Ski Freestyle | `ski--ski-freestyle` |
| Ski · Telemark | `ski--telemark` |
| Ski · Randonnée Nordique | `ski--randonnee-nordique` |
| Ski · Ski sur Herbe | `ski--ski-sur-herbe` |
| Ski · Saut à Ski | `ski--saut-a-ski` |
| Ski · Combiné Nordique | `ski--combine-nordique` |
| Ski · Ski de Vitesse | `ski--ski-de-vitesse` |
| Ski · Biathlon running | `ski--biathlon-running` |
| Ski · Hors piste – freeride | `ski--hors-piste-freeride` |
| Ski · Ski Forme | `ski--ski-forme` |
| Ski · Ski Santé | `ski--ski-sante` |
| Sports de glace · Patinage artistique | `sports-de-glace--patinage-artistique` |
| Sports de glace · Danse sur glace | `sports-de-glace--danse-sur-glace` |
| Sports de glace · Ballet sur glace | `sports-de-glace--ballet-sur-glace` |
| Sports de glace · Curling | `sports-de-glace--curling` |
| Sports de glace · Patinage synchronisé | `sports-de-glace--patinage-synchronise` |
| Sports de glace · Sports Extreme | `sports-de-glace--sports-extreme` |
| Sports de glace · Short-Track | `sports-de-glace--short-track` |
| Sports de glace · Glace Inline | `sports-de-glace--glace-inline` |
| Sports de glace · Ice Cross | `sports-de-glace--ice-cross` |
| Sports de glace · Freestyle | `sports-de-glace--freestyle` |
| Sports de glace · Bobsleigh | `sports-de-glace--bobsleigh` |
| Sports de glace · Luge | `sports-de-glace--luge` |
| Sports de glace · Skeleton | `sports-de-glace--skeleton` |
| Danse · Modern jazz | `danse--modern-jazz` |
| Danse · Jazz | `danse--jazz` |
| Danse · Danses hip-hop | `danse--danses-hip-hop` |
| Danse · Ateliers de création | `danse--ateliers-de-creation` |
| Danse · Contemporain | `danse--contemporain` |
| Danse · Danses latines | `danse--danses-latines` |
| Danse · Classique | `danse--classique` |
| Danse · Danses standards | `danse--danses-standards` |
| Danse · Danses de salon | `danse--danses-de-salon` |
| Danse · Salsa | `danse--salsa` |
| Danse · Bachata | `danse--bachata` |
| Danse · Rock'n'roll | `danse--rock-n-roll` |
| Danse · Country & line | `danse--country-line` |
| Danse · Danses ethniques | `danse--danses-ethniques` |
| Danse · Zumba | `danse--zumba` |
| Danse · Rock sauté | `danse--rock-saute` |
| Danse · Barre au sol classique | `danse--barre-au-sol-classique` |
| Danse · Barre au sol contemporaine | `danse--barre-au-sol-contemporaine` |
| Danse · West Coast Swing | `danse--west-coast-swing` |
| Danse · Pole dance | `danse--pole-dance` |
| Danse · Breaking | `danse--breaking` |
| Danse · Kizomba | `danse--kizomba` |
| Danse · Cabaret | `danse--cabaret` |
| Danse · Boogie-Woogie | `danse--boogie-woogie` |
| Danse · Lindy hop | `danse--lindy-hop` |
| Danse · Disco | `danse--disco` |
| Danse · Comédie musicale | `danse--comedie-musicale` |
| Danse · Danses aériennes | `danse--danses-aeriennes` |
| Danse · Pole sport | `danse--pole-sport` |
| Danse · Tango argentin | `danse--tango-argentin` |
| Danse · Danses latino-caraïbes | `danse--danses-latino-caraibes` |
| Danse · Claquettes | `danse--claquettes` |
| Danse · Afro-jazz | `danse--afro-jazz` |
| Danse · Rock acrobatique | `danse--rock-acrobatique` |
| Danse · Flamenco | `danse--flamenco` |
| Danse · Danses traditionnelles | `danse--danses-traditionnelles` |
| Danse · Danse historique | `danse--danse-historique` |
| Parachutisme · Parachutisme | `parachutisme--parachutisme` |
| Parachutisme · Ascensionnel | `parachutisme--ascensionnel` |
| Parachutisme · Parapente | `parachutisme--parapente` |
| Parachutisme · Soufflerie | `parachutisme--soufflerie` |
| Vol en planeur · Remorquage | `vol-en-planeur--remorquage` |
| Vol en planeur · ePlaneur | `vol-en-planeur--eplaneur` |
| Vol en planeur · Motoplaneur | `vol-en-planeur--motoplaneur` |
| Vol en planeur · Treuil | `vol-en-planeur--treuil` |
| Vol en planeur · Voltige | `vol-en-planeur--voltige` |
| Billard · Carambole | `billard--carambole` |
| Billard · Blackball | `billard--blackball` |
| Billard · Américain | `billard--americain` |
| Billard · Snooker | `billard--snooker` |
