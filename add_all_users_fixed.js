const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Create database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
    
    // Add all users from CSV
    addAllUsers();
});

function addAllUsers() {
    // Read usernames from CSV file
    const usernamesPath = path.join(__dirname, 'usernames.csv');
    
    fs.readFile(usernamesPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading usernames CSV file:', err);
            db.end();
            return;
        }
        
        // Parse CSV data
        const lines = data.split('\n');
        const users = [];
        
        // Skip header line
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const [bankName, username, password] = line.split(',').map(field => field.trim().replace(/^"|"$/g, ''));
                if (bankName && username && password) {
                    // Generate bank_id based on index
                    const bankId = 'BANK' + (i < 10 ? '00' + i : i < 100 ? '0' + i : i);
                    
                    // Determine division based on bank name
                    let division = 'Unknown';
                    if (bankName.includes('Gampaha') || bankName.includes('Aluthgama') || bankName.includes('Amunugoda') || 
                        bankName.includes('Ganemulla') || bankName.includes('Henarathgoda') || bankName.includes('Kirindivita') || 
                        bankName.includes('Weliweriya') || bankName.includes('Yakkala')) {
                        division = 'Gampaha';
                    } else if (bankName.includes('Negombo') || bankName.includes('Negumbo') || bankName.includes('Kammalthura') || 
                               bankName.includes('Pallansena') || bankName.includes('Kochchikade') || bankName.includes('Daluwakotuwa') || 
                               bankName.includes('Ettukala') || bankName.includes('Kudapaduwa') || bankName.includes('Wella Weediya') || 
                               bankName.includes('Periyamulla') || bankName.includes('Angurukaramulla') || bankName.includes('Udayarthoppuwa') || 
                               bankName.includes('Munnakkarai') || bankName.includes('Doowa') || bankName.includes('Pitipana') || 
                               bankName.includes('Bolawalana') || bankName.includes('Kurana') || bankName.includes('Siriwardana') || 
                               bankName.includes('South Pitipana') || bankName.includes('Thalahena') || bankName.includes('Dungalpitiya') || 
                               bankName.includes('Seththappaduwa') || bankName.includes('Kepungoda')) {
                        division = 'Negombo';
                    } else if (bankName.includes('Biyagama') || bankName.includes('Delgoda') || bankName.includes('Gonawala') || 
                               bankName.includes('Makola') || bankName.includes('Bopitiya') || bankName.includes('Pamunugama') || 
                               bankName.includes('Welisara') || bankName.includes('Hendala') || bankName.includes('Kurunduhena') || 
                               bankName.includes('Maththumagala') || bankName.includes('Wattala') || bankName.includes('Evariwatta') || 
                               bankName.includes('Thelagapatha')) {
                        division = 'Biyagama';
                    } else if (bankName.includes('Ja-ela') || bankName.includes('Dandugama') || bankName.includes('Kudahakapola') || 
                               bankName.includes('Ekala') || bankName.includes('Thudella') || bankName.includes('Kanuwana') || 
                               bankName.includes('Alexendrawatta') || bankName.includes('Batagama') || bankName.includes('Niwandama') || 
                               bankName.includes('Ragama') || bankName.includes('Kandana') || bankName.includes('Hapugoda') || 
                               bankName.includes('Kalaeliya') || bankName.includes('Nedurupitiya') || bankName.includes('Rilavulla')) {
                        division = 'Ja-Ela';
                    } else if (bankName.includes('Dompe') || bankName.includes('Wathurugama') || bankName.includes('Bandaranayakapura') || 
                               bankName.includes('Mailawalana') || bankName.includes('Thimbirigama') || bankName.includes('Mahal Loluwa') || 
                               bankName.includes('Millathe') || bankName.includes('Kirindiwela') || bankName.includes('Bogahawatta') || 
                               bankName.includes('Radawana') || bankName.includes('Diyawala') || bankName.includes('Meddegama') || 
                               bankName.includes('Udagama') || bankName.includes('Pingamuwa') || bankName.includes('Hiswella') || 
                               bankName.includes('Werahera') || bankName.includes('Pallegama') || bankName.includes('Anuragoda') || 
                               bankName.includes('Nedungolla') || bankName.includes('Mandawala') || bankName.includes('Keragala') || 
                               bankName.includes('Pelahela') || bankName.includes('Lunugama') || bankName.includes('Pelpita') || 
                               bankName.includes('Putupagala') || bankName.includes('Demalagama') || bankName.includes('Helummahara') || 
                               bankName.includes('Ovitigama') || bankName.includes('Bangalawatta') || bankName.includes('Kumarimulla') || 
                               bankName.includes('Indolamulla') || bankName.includes('Dekatana') || bankName.includes('Kalukondayawa') || 
                               bankName.includes('Dompe') || bankName.includes('Guruwala') || bankName.includes('Giridara') || 
                               bankName.includes('Malinda') || bankName.includes('Palugama') || bankName.includes('Mapitigama') || 
                               bankName.includes('Udamapitigama') || bankName.includes('Welgama') || bankName.includes('Samanabedda') || 
                               bankName.includes('Mahawalawatta') || bankName.includes('Thittapattara')) {
                        division = 'Dompe';
                    } else if (bankName.includes('Attanagalla') || bankName.includes('Eluwapitiya') || bankName.includes('Hiripitiya') || 
                               bankName.includes('Thalgasmote') || bankName.includes('Humbutiyawa') || bankName.includes('Veyangoda') || 
                               bankName.includes('Kongasdeniya') || bankName.includes('Wedagama') || bankName.includes('Kalalpitiya') || 
                               bankName.includes('Nawagamuwa') || bankName.includes('Napagoda') || bankName.includes('Nittambuwa') || 
                               bankName.includes('Kolawatta') || bankName.includes('Pattalagedara') || bankName.includes('Wataddara') || 
                               bankName.includes('Magalegoda') || bankName.includes('Heendeniya') || bankName.includes('Pattigoda') || 
                               bankName.includes('Dadagamuwa') || bankName.includes('Pinnagolla') || bankName.includes('Nambadaluwa') || 
                               bankName.includes('Orchardwatta') || bankName.includes('Malwatta') || bankName.includes('Thihariya') || 
                               bankName.includes('Katuwasgoda') || bankName.includes('Mudagamuwa') || bankName.includes('Bandarabatawala') || 
                               bankName.includes('Pitiyegedara') || bankName.includes('Bemmulla') || bankName.includes('Kandaoluwawa') || 
                               bankName.includes('Raniswala') || bankName.includes('Thiriwanegama') || bankName.includes('Halgampitiya') || 
                               bankName.includes('Kalagedihena') || bankName.includes('Thihariyagama') || bankName.includes('Kalotuwawa') || 
                               bankName.includes('Kattota') || bankName.includes('Bogoda') || bankName.includes('Maimbula') || 
                               bankName.includes('Wathupitiwala') || bankName.includes('Walpola') || bankName.includes('Haggalla') || 
                               bankName.includes('Ellakkala') || bankName.includes('Godagama') || bankName.includes('Welikadamulla') || 
                               bankName.includes('Karasnagala') || bankName.includes('Alawala') || bankName.includes('Ethaudakanda') || 
                               bankName.includes('Nikahetikanda') || bankName.includes('Palkumbura') || bankName.includes('Pelpita') || 
                               bankName.includes('Walaliyadda') || bankName.includes('Diyakade') || bankName.includes('Welagedara') || 
                               bankName.includes('Kamburagalla') || bankName.includes('Mathalana') || bankName.includes('Meewala') || 
                               bankName.includes('Kitttammahara') || bankName.includes('Bogamuwa') || bankName.includes('Mangalathiriya') || 
                               bankName.includes('Pilankada') || bankName.includes('Bonegala') || bankName.includes('Udugoda') || 
                               bankName.includes('Hunupola') || bankName.includes('Pannila') || bankName.includes('Halpandeniya') || 
                               bankName.includes('Urapola') || bankName.includes('Wanduramulla') || bankName.includes('Deenapamunuwa') || 
                               bankName.includes('Yatawaka') || bankName.includes('Sapugasthenna') || bankName.includes('Bopagama') || 
                               bankName.includes('Meevitagammana') || bankName.includes('Bopetta') || bankName.includes('Nagoda') || 
                               bankName.includes('Kurawalana') || bankName.includes('Aruppassa') || bankName.includes('Kahatovita') || 
                               bankName.includes('Ogodapola') || bankName.includes('Kahambiliyahena') || bankName.includes('Udathuththiripitiya') || 
                               bankName.includes('Mattagoda') || bankName.includes('Weerangula') || bankName.includes('Koskandawala') || 
                               bankName.includes('Kirikittamulla') || bankName.includes('Opathella') || bankName.includes('Paranagama') || 
                               bankName.includes('Ruwanpura') || bankName.includes('Lavulupitiya') || bankName.includes('Galboda') || 
                               bankName.includes('Dematalanda') || bankName.includes('Happitiya') || bankName.includes('Bopagama')) {
                        division = 'Attanagalla';
                    } else if (bankName.includes('Minuwangoda') || bankName.includes('Medemulla') || bankName.includes('Nilpanagoda') || 
                               bankName.includes('Arangawa') || bankName.includes('Horampella') || bankName.includes('Galkanda') || 
                               bankName.includes('Bodhipihituwala') || bankName.includes('Watinapaha') || bankName.includes('Mabodala') || 
                               bankName.includes('Vithanamulla') || bankName.includes('Nalapaha') || bankName.includes('Wankepumulla') || 
                               bankName.includes('Kamaragoda') || bankName.includes('Kudagoda') || bankName.includes('Mahagama') || 
                               bankName.includes('Wegowwa') || bankName.includes('Minuwangoda') || bankName.includes('Boragodawatta') || 
                               bankName.includes('Yatiyana') || bankName.includes('Peellawatta') || bankName.includes('Unnaruwa') || 
                               bankName.includes('Kopiwatta') || bankName.includes('Balabowa') || bankName.includes('Pethiyagoda') || 
                               bankName.includes('Ganihimulla') || bankName.includes('Hendimahara') || bankName.includes('Kalawana') || 
                               bankName.includes('Wattegedara') || bankName.includes('Ambagahawatta') || bankName.includes('Galloluwa') || 
                               bankName.includes('Kalahugoda') || bankName.includes('Polwatta') || bankName.includes('Pattanduwana') || 
                               bankName.includes('Ellangala') || bankName.includes('Burullapitiya') || bankName.includes('Mathammana') || 
                               bankName.includes('Weediyawatta') || bankName.includes('Goigama') || bankName.includes('Udugampola') || 
                               bankName.includes('Korase') || bankName.includes('Marapola') || bankName.includes('Vigoda') || 
                               bankName.includes('Doranagoda') || bankName.includes('Yagodamulla') || bankName.includes('Samurdhigama') || 
                               bankName.includes('Opatha') || bankName.includes('Kotugoda') || bankName.includes('Maduruwita') || 
                               bankName.includes('Siyambalapitiya') || bankName.includes('Madelgamuwa') || bankName.includes('Batapotha') || 
                               bankName.includes('Nedagamuwa') || bankName.includes('Arachchiwatta') || bankName.includes('Thammita') || 
                               bankName.includes('Asgiriwalpola') || bankName.includes('Asgiriya') || bankName.includes('Kumbaloluwa') || 
                               bankName.includes('Dombawela') || bankName.includes('Pedipola') || bankName.includes('Wathumulla')) {
                        division = 'Minuwangoda';
                    } else if (bankName.includes('Divulapitiya') || bankName.includes('Andimulla') || bankName.includes('Ambalayaya') || 
                               bankName.includes('Bolagala') || bankName.includes('Otharawadiya') || bankName.includes('Godigamuwa') || 
                               bankName.includes('Balawala') || bankName.includes('Badalgama') || bankName.includes('Delpakadawara') || 
                               bankName.includes('Sirigapathawatta') || bankName.includes('Pethigoda') || bankName.includes('Alugolla') || 
                               bankName.includes('Polwatta') || bankName.includes('Polhena') || bankName.includes('Mellawagedara') || 
                               bankName.includes('Diklanda') || bankName.includes('Katukenda') || bankName.includes('Akarangaha') || 
                               bankName.includes('Kehelella') || bankName.includes('Lihiniyagammana') || bankName.includes('Akaragama') || 
                               bankName.includes('Madampella') || bankName.includes('Pahala Madampella') || bankName.includes('Kaluwarippuwa') || 
                               bankName.includes('Kongodamulla') || bankName.includes('Heenatiyana') || bankName.includes('Raddolugama') || 
                               bankName.includes('Raddoluwa') || bankName.includes('Seeduwa') || bankName.includes('Mookalangamuwa') || 
                               bankName.includes('Bandarawatta') || bankName.includes('Dambaduraya') || bankName.includes('Lansiyawadiya') || 
                               bankName.includes('Kotugoda') || bankName.includes('Kasagahawatta') || bankName.includes('Udammita') || 
                               bankName.includes('Alawathupitiya') || bankName.includes('Ambalammulla') || bankName.includes('Induragara') || 
                               bankName.includes('Kadawala') || bankName.includes('Dagonna') || bankName.includes('Halgahawelawatta') || 
                               bankName.includes('Katuwellegama') || bankName.includes('Palugahawela') || bankName.includes('Kimbulapitiya') || 
                               bankName.includes('Andiambalama') || bankName.includes('Dewamottawa') || bankName.includes('Kovinna') || 
                               bankName.includes('Evariwatta') || bankName.includes('Air Force Camp') || bankName.includes('Kurana') || 
                               bankName.includes('Katunayaka') || bankName.includes('Walanagoda') || bankName.includes('Kalahapitiya') || 
                               bankName.includes('Madawala') || bankName.includes('Muthuwadiya') || bankName.includes('Liyanagemulla') || 
                               bankName.includes('Amandoluwa') || bankName.includes('Thampala') || bankName.includes('Kuswala') || 
                               bankName.includes('Ganepola') || bankName.includes('Sellakanda') || bankName.includes('Katuwapitiya') || 
                               bankName.includes('Mahahunupitiya') || bankName.includes('Kadirana') || bankName.includes('Akkara') || 
                               bankName.includes('Muruthana') || bankName.includes('Manaveriya') || bankName.includes('Udangawa') || 
                               bankName.includes('Thoppuwa') || bankName.includes('Bambukuliya') || bankName.includes('Katana')) {
                        division = 'Divulapitiya';
                    } else if (bankName.includes('Mirigama') || bankName.includes('Giriullagama') || bankName.includes('Loluwagoda') || 
                               bankName.includes('Delwala') || bankName.includes('Madurupitiya') || bankName.includes('Hapugahagedara') || 
                               bankName.includes('Kadangamuwa') || bankName.includes('Henegama') || bankName.includes('Maladeniya') || 
                               bankName.includes('Kahadawa') || bankName.includes('Kandalama') || bankName.includes('Walbotale') || 
                               bankName.includes('Perisyala') || bankName.includes('Kamarangawa') || bankName.includes('Keenadeniya') || 
                               bankName.includes('Bothale') || bankName.includes('Hapugahagedara') || bankName.includes('Maweehena') || 
                               bankName.includes('Kurunduwatta') || bankName.includes('Purana Meerigama') || bankName.includes('Hakurukumbura') || 
                               bankName.includes('Mugurugampala') || bankName.includes('Vilwatta') || bankName.includes('Thawalampitiya') || 
                               bankName.includes('Thalagama') || bankName.includes('Balathawa') || bankName.includes('Makura') || 
                               bankName.includes('Pottekanda') || bankName.includes('Adagalakanda') || bankName.includes('Halugama') || 
                               bankName.includes('Kidiwala') || bankName.includes('Lindara') || bankName.includes('Pohonnaruwa') || 
                               bankName.includes('Indiparape') || bankName.includes('Kosetadeniya') || bankName.includes('Imbulanwala') || 
                               bankName.includes('Uduulla') || bankName.includes('Gaspe') || bankName.includes('Banduragoda') || 
                               bankName.includes('Keppitiwalana') || bankName.includes('Galgana') || bankName.includes('Pelapitigama') || 
                               bankName.includes('Elhena') || bankName.includes('Ganegoda') || bankName.includes('Hiriwala') || 
                               bankName.includes('Handurumulla') || bankName.includes('Pamunuwatta') || bankName.includes('Arukgoda') || 
                               bankName.includes('Madabavita') || bankName.includes('Nawgala') || bankName.includes('Danovita') || 
                               bankName.includes('Weweldeniya') || bankName.includes('Henepola') || bankName.includes('Palmada') || 
                               bankName.includes('Kal') || bankName.includes('Pallewela') || bankName.includes('Kotakanda') || 
                               bankName.includes('Raddelgoda') || bankName.includes('Bokalagama') || bankName.includes('Kukulnape') || 
                               bankName.includes('Muddaragama') || bankName.includes('Hanchapola') || bankName.includes('Dathgama') || 
                               bankName.includes('Pathagama') || bankName.includes('Borukgamuwa') || bankName.includes('Midellawala') || 
                               bankName.includes('Nungamuwa') || bankName.includes('Kendalanda') || bankName.includes('Uthuwambogahawatta') || 
                               bankName.includes('Maligathenna') || bankName.includes('Wandurawa') || bankName.includes('Galgamuwa') || 
                               bankName.includes('Kumbaloluwa') || bankName.includes('Dumunnegedara') || bankName.includes('Pasyala') || 
                               bankName.includes('Muruthawala') || bankName.includes('Ellalamulla') || bankName.includes('Kithanawatta') || 
                               bankName.includes('Kammalpitiya') || bankName.includes('Radawadunna') || bankName.includes('Imbulgasovita') || 
                               bankName.includes('Weerasooriyakanda') || bankName.includes('Hakwaduna') || bankName.includes('Kureekotuwa') || 
                               bankName.includes('Debahera') || bankName.includes('Mawathahena') || bankName.includes('Meevitiya') || 
                               bankName.includes('Ketakalapitiya') || bankName.includes('Dambutuwa') || bankName.includes('Mirigama')) {
                        division = 'Mirigama';
                    } else if (bankName.includes('Mahara') || bankName.includes('Kimbulgoda') || bankName.includes('Pituwalgoda') || 
                               bankName.includes('Kinigama') || bankName.includes('Maharagama') || bankName.includes('Siwralumulla') || 
                               bankName.includes('Pilikuththuwa') || bankName.includes('Yongammulla') || bankName.includes('Ambgaspitiya') || 
                               bankName.includes('Warapalana') || bankName.includes('Kandumulla') || bankName.includes('Pasgammana') || 
                               bankName.includes('Maligathenna') || bankName.includes('Batepola') || bankName.includes('Amunukumbura') || 
                               bankName.includes('Malwathuhiripitiya') || bankName.includes('Buthpitiya') || bankName.includes('Uruwala') || 
                               bankName.includes('Neelamahara') || bankName.includes('Aramangoda') || bankName.includes('Puwakpitiya') || 
                               bankName.includes('Vilimbula') || bankName.includes('Kahatana') || bankName.includes('Henegama') || 
                               bankName.includes('Etikehelgalla') || bankName.includes('Kirikitta') || bankName.includes('Ahugammana') || 
                               bankName.includes('Naranwala') || bankName.includes('Udupila') || bankName.includes('Webada') || 
                               bankName.includes('Kirillawala') || bankName.includes('Sooriyapaluwa') || bankName.includes('Kendaliyeddapaluwa') || 
                               bankName.includes('Dangahawela') || bankName.includes('Nugegoda') || bankName.includes('Karagahamuna') || 
                               bankName.includes('Neligama') || bankName.includes('Kopiwatta') || bankName.includes('Dalupitiya') || 
                               bankName.includes('Pinnameda') || bankName.includes('Gongithota') || bankName.includes('Appugewatta') || 
                               bankName.includes('Enderamulla') || bankName.includes('Nathuduwa') || bankName.includes('Akbar Town') || 
                               bankName.includes('Gonahena') || bankName.includes('Eldeniya') || bankName.includes('Puwakwetiya')) {
                        division = 'Mahara';
                    } else if (bankName.includes('Kelaniya') || bankName.includes('Welegoda') || bankName.includes('Hunupitiya') || 
                               bankName.includes('Eriyawetiya') || bankName.includes('Kiribathgoda') || bankName.includes('Thalawathuhenpita') || 
                               bankName.includes('Kendahena') || bankName.includes('Egoda Eriyawetiya') || bankName.includes('Wanawasala') || 
                               bankName.includes('Dippitigoda') || bankName.includes('Weweldoowa') || bankName.includes('Warakanatta') || 
                               bankName.includes('Koholvila') || bankName.includes('Nahena') || bankName.includes('Dalugamgoda') || 
                               bankName.includes('Nungamugoda') || bankName.includes('Dalugama') || bankName.includes('Himbutuwelgoda') || 
                               bankName.includes('Pattiya') || bankName.includes('Meegahawatta') || bankName.includes('Peliyagodawatta') || 
                               bankName.includes('Peliyagoda') || bankName.includes('Wedamulla') || bankName.includes('Galborella') || 
                               bankName.includes('Polhena') || bankName.includes('Kelaniya') || bankName.includes('Pethiyagoda') || 
                               bankName.includes('Mawella') || bankName.includes('Sinharamulla') || bankName.includes('Pilapitiya')) {
                        division = 'Kelaniya';
                    } else if (bankName.includes('Katana') || bankName.includes('Muruthana') || bankName.includes('Manaveriya') || 
                               bankName.includes('Udangawa') || bankName.includes('Thoppuwa') || bankName.includes('Bambukuliya') || 
                               bankName.includes('Katana North') || bankName.includes('Katana East') || bankName.includes('Katana West') || 
                               bankName.includes('Ethgala') || bankName.includes('Maha Ethgala') || bankName.includes('Adikkandiya') || 
                               bankName.includes('Welihena') || bankName.includes('Kandawala') || bankName.includes('Pahala Kandawala') || 
                               bankName.includes('Ihala Kandawala') || bankName.includes('Kaluwarippuwa') || bankName.includes('Kondagammulla') || 
                               bankName.includes('Katiyala') || bankName.includes('Kadirana') || bankName.includes('Akkara') || 
                               bankName.includes('K.C. De Silvapura') || bankName.includes('Thimbirigaskatuwa') || bankName.includes('Sellakanda') || 
                               bankName.includes('Katuwapitiya') || bankName.includes('Mahahunupitiya') || bankName.includes('Andiambalama') || 
                               bankName.includes('Walanagoda') || bankName.includes('Dewamottawa') || bankName.includes('Evariwatta') || 
                               bankName.includes('Air Force Camp') || bankName.includes('Kurana') || bankName.includes('Katunayaka') || 
                               bankName.includes('Muthuwadiya') || bankName.includes('Liyanagemulla') || bankName.includes('Amandoluwa') || 
                               bankName.includes('Thampala') || bankName.includes('Kuswala') || bankName.includes('Ganepola') || 
                               bankName.includes('Wella Weediya') || bankName.includes('Periyamulla') || bankName.includes('Angurukaramulla') || 
                               bankName.includes('Udayarthoppuwa') || bankName.includes('Munnakkarai') || bankName.includes('Doowa') || 
                               bankName.includes('Pitipana') || bankName.includes('Bolawalana') || bankName.includes('Kurana') || 
                               bankName.includes('Siriwardana') || bankName.includes('South Pitipana') || bankName.includes('Thalahena') || 
                               bankName.includes('Dungalpitiya') || bankName.includes('Seththappaduwa') || bankName.includes('Kepungoda') || 
                               bankName.includes('Raddolugama') || bankName.includes('Raddoluwa') || bankName.includes('Seeduwa') || 
                               bankName.includes('Mookalangamuwa') || bankName.includes('Bandarawatta') || bankName.includes('Dambaduraya') || 
                               bankName.includes('Lansiyawadiya') || bankName.includes('Kotugoda') || bankName.includes('Kasagahawatta') || 
                               bankName.includes('Udammita') || bankName.includes('Alawathupitiya') || bankName.includes('Ambalammulla')) {
                        division = 'Katana';
                    } else if (bankName.includes('Wattala') || bankName.includes('Delathura') || bankName.includes('Bopitiyathuduwa') || 
                               bankName.includes('Bopitiya') || bankName.includes('Pulluhena') || bankName.includes('Paranambalama') || 
                               bankName.includes('Nugape') || bankName.includes('Kunjawaththa') || bankName.includes('Magulpokuna') || 
                               bankName.includes('Elehiwaththa') || bankName.includes('Welisara') || bankName.includes('Pattiyawala') || 
                               bankName.includes('Uswetakeiyawa') || bankName.includes('Mahabage') || bankName.includes('Elapitiwala') || 
                               bankName.includes('Horapethuduwa') || bankName.includes('Horape') || bankName.includes('Kurukualawa') || 
                               bankName.includes('Heenkenda') || bankName.includes('Thuduwegedara') || bankName.includes('Galudupita') || 
                               bankName.includes('Maththumagala') || bankName.includes('Kernga Pokuna') || bankName.includes('Kerawalapitiya') || 
                               bankName.includes('Matagoda') || bankName.includes('Balagala') || bankName.includes('Dikovita') || 
                               bankName.includes('Palliyawatta') || bankName.includes('Elakanda') || bankName.includes('Nayaka Kanda') || 
                               bankName.includes('Mabola') || bankName.includes('Welikadamulla') || bankName.includes('Wattala') || 
                               bankName.includes('Hendala') || bankName.includes('Nayak Kanda') || bankName.includes('Thimbirigasyaya') || 
                               bankName.includes('Kurunduhena') || bankName.includes('Evariwatta') || bankName.includes('Thelagapatha') || 
                               bankName.includes('Galwetiya')) {
                        division = 'Wattala';
                    }
                    
                    users.push({
                        username: username,
                        password: password,
                        bank_id: bankId,
                        bank_name: bankName,
                        division: division
                    });
                }
            }
        }
        
        console.log(`Processing ${users.length} users from CSV file`);
        
        // Insert users into database
        let insertCount = 0;
        let processedCount = 0;
        
        if (users.length === 0) {
            console.log('No users to insert');
            db.end();
            return;
        }
        
        users.forEach(user => {
            bcrypt.hash(user.password, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10, (err, hash) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    processedCount++;
                    checkCompletion();
                    return;
                }
                
                const query = 'INSERT INTO users (username, password, bank_id, bank_name, division) VALUES (?, ?, ?, ?, ?)';
                db.query(query, [user.username, hash, user.bank_id, user.bank_name, user.division], (err, result) => {
                    processedCount++;
                    if (err) {
                        // Ignore duplicate entry errors
                        if (err.code !== 'ER_DUP_ENTRY') {
                            console.error('Error inserting user:', err);
                        }
                    } else {
                        console.log(`User ${user.username} inserted successfully`);
                        insertCount++;
                    }
                    
                    checkCompletion();
                });
            });
        });
        
        function checkCompletion() {
            if (processedCount === users.length) {
                console.log(`Inserted ${insertCount} users from CSV file`);
                db.end();
            }
        }
    });
}