export const FREQUENCIES = ['Monthly', 'Quarterly', 'Annually', 'Weekly', 'Daily', 'Giro', 'One-time', '-'];
export const MODES = [
  'TT to Bryan', 'OCBC Savings Kelly', 'OCBC CC Kelly', 'CREDIT CARD GIRO',
  'CREDIT CARD OCBC V', 'CREDIT CARDS', 'DBS Bank TT Kelly', 'OCBC CC Vincent',
  'Cash / OCBC CC Kelly', 'OCBC CDA Acct', 'Paynow to Sch', 'Paynow to Centre',
  'Cash / TT to her DBS', 'GIRO POSB A/c', 'CREDIT CARD GIRO', 'OCBC CC Vincent',
  'DBS Giro', 'Kelly UOB', 'Paynow', 'AXS - non giro', 'Cash', 'Paynow', '-'
];

let _nextId = 1000;
export const nextId = () => String(_nextId++);

export const initialClients = [
  {
    id: 'kelly',
    name: 'Kelly',
    sections: [
      {
        id: 'personal',
        label: 'Personal Expenses',
        splitPercentage: null,
        items: [
          { id: '1', no: 1, item: 'Coleman Expenses', amount: 450, description: '$631 insurance, $120 piano, $100 enrichments (total $1k but split with bryan)', frequency: 'Monthly', date: '28th', mode: 'TT to Bryan' },
          { id: '3', no: 3, item: 'Insurance', amount: 700, description: 'Hospital & Life Insurance (Tokio Marine both)', frequency: 'Monthly', date: '3rd', mode: 'OCBC Savings Kelly' },
          { id: '4', no: 4, item: 'Income Tax', amount: 2500, description: 'YR 2024 ($2400 April, May $1600 11 mths)', frequency: 'Monthly', date: '3rd', mode: 'OCBC Savings Kelly' },
          { id: '5', no: 5, item: 'Medisave', amount: 630, description: 'YR 2024', frequency: 'Monthly', date: '25th', mode: 'OCBC Savings Kelly' },
          { id: '6', no: 6, item: 'Personal Uses', amount: 1000, description: 'Facial product, sundries and online uses', frequency: '-', date: '-', mode: 'OCBC CC Kelly' },
          { id: '7', no: 7, item: 'Starhub', amount: 200, description: 'My HP Bill', frequency: 'Giro', date: '1st', mode: 'CREDIT CARD GIRO' },
          { id: '8', no: 8, item: 'Home Insurance', amount: 250, description: "3M Policy for Clavon - $2400/yr (1st Oct 2023 - 30th Nov 2024)", frequency: 'Annually', date: "Nov'23", mode: 'CREDIT CARD OCBC V' },
          { id: '9', no: 9, item: 'Entertainment', amount: 1500, description: '-', frequency: 'Monthly', date: '28th', mode: 'CREDIT CARDS' },
          { id: '10', no: 10, item: 'Personal Development', amount: 500, description: 'Train The Trainer NLP', frequency: 'One-time', date: 'depends', mode: 'OCBC Savings Kelly' },
          { id: '11', no: 11, item: 'Marketing Cost', amount: 6500, description: 'Property guru, social media and mgt fees etc', frequency: '-', date: '-', mode: '-' },
          { id: '14', no: 14, item: 'Traveling Plans', amount: 500, description: 'Set aside to use for traveling plans', frequency: '-', date: '-', mode: '-' },
        ],
      },
      {
        id: 'household',
        label: 'Household',
        splitPercentage: 60,
        items: [
          { id: 'h1', no: 1, item: 'Helper Salary', amount: 1600, description: 'Salary', frequency: 'Monthly', date: '28th', mode: 'Cash / TT to her DBS' },
          { id: 'h2', no: 2, item: 'Helper Levy', amount: 120, description: 'Helper levy', frequency: 'Monthly', date: '1st', mode: 'GIRO POSB A/c' },
          { id: 'h3', no: 3, item: 'Starhub', amount: 120, description: 'House Wifi $45 + $20 for mobile lines for ipad & helper phone', frequency: 'Giro', date: '1st', mode: 'CREDIT CARD GIRO' },
          { id: 'h4', no: 4, item: 'Household Groceries', amount: 2000, description: '$1000 shoppee and $1000 for NTUC and last min', frequency: 'Weekly', date: '-', mode: 'OCBC CC Vincent' },
          { id: 'h5', no: 5, item: 'Cash for Daily Uses', amount: 800, description: '$20 a day x 30 days', frequency: 'Monthly', date: '-', mode: 'Cash' },
          { id: 'h6', no: 6, item: 'Mortgage', amount: 5600, description: '$4600 Giro', frequency: 'Giro', date: '5th', mode: 'DBS Giro' },
          { id: 'h7', no: 7, item: 'Car Loan', amount: 2347, description: 'Giro', frequency: 'Giro', date: '3rd', mode: 'Kelly UOB' },
          { id: 'h8', no: 8, item: 'Car Insurance', amount: 68, description: 'Annual car insurance $808 (from 30th Jul - 29th Jul 2024)', frequency: 'Annually', date: 'Jul', mode: 'Paynow' },
          { id: 'h9', no: 9, item: 'Season Parking', amount: 120, description: 'Renew mthly on 28th', frequency: 'Monthly', date: '28th', mode: 'AXS - non giro' },
          { id: 'h10', no: 10, item: 'Road Tax', amount: 136, description: '820 per half year', frequency: 'Giro', date: "Jul'23", mode: 'AXS - non giro' },
          { id: 'h11', no: 11, item: 'SP Bill', amount: 250, description: 'Estimated', frequency: 'Giro', date: '15th', mode: '-' },
          { id: 'h12', no: 12, item: 'Petrol', amount: 1000, description: 'Every 4-5 days $100 per refuel, round up to 1000 a mth as average', frequency: 'Monthly', date: '28th', mode: 'OCBC CC Vincent' },
          { id: 'h13', no: 13, item: 'Family Dinners/Outings', amount: 1500, description: 'dinner at restaurants, buy stuff for kids etc', frequency: 'Monthly', date: '28th', mode: 'CREDIT CARDS' },
          { id: 'h14', no: 14, item: 'Kel & Vin Eat Out', amount: 1500, description: 'When working and not able to eat at home', frequency: 'Daily', date: '-', mode: 'Cash/Paynow/CC' },
          { id: 'h15', no: 15, item: 'Rent', amount: 2050, description: '-', frequency: 'Monthly', date: '-', mode: '-' },
        ],
      },
      {
        id: 'children',
        label: 'Children Expenses',
        splitPercentage: 60,
        children: [
          {
            id: 'clarisse',
            name: 'Clarisse',
            items: [
              { id: 'c1', no: 1, item: 'HCL', amount: 1650, description: 'Sch Fees - need transfer to cda mthly clarisse', frequency: 'Monthly', date: '28th', mode: 'OCBC CDA Acct' },
              { id: 'c2', no: 2, item: 'Swimming', amount: 100, description: '1 term (Jan - Mar) - $300 - course fee only. monthly $100', frequency: 'Quarterly', date: '-', mode: 'Paynow to Sch' },
              { id: 'c3', no: 3, item: 'Learning Lab', amount: 200, description: '$1584 for 9 months', frequency: 'Quarterly', date: '-', mode: 'Paynow to Centre' },
              { id: 'c4', no: 4, item: 'Insurance - CI', amount: 214, description: '$2566 / year - 214/mth (due in Jan 2024)', frequency: 'Annually', date: "Jan'24", mode: 'DBS Bank TT Kelly' },
              { id: 'c5', no: 5, item: 'Insurance - Hospital', amount: 65, description: 'Basic Preferred plan: S$205(CPF Medisave) Medishield: S$130(CPF Medisave) Rider: Deluxe Care: S$441(Cash)', frequency: 'Annually', date: "Apr'23", mode: 'OCBC CC Vincent' },
              { id: 'c6', no: 6, item: 'Miscellaneous', amount: 200, description: 'snacks, supps, etc', frequency: 'Monthly', date: '-', mode: 'Cash / OCBC CC Kelly' },
            ],
          },
          {
            id: 'claudine',
            name: 'Claudine',
            items: [
              { id: 'd1', no: 1, item: 'MapleBear', amount: 1650, description: 'Sch Fees', frequency: 'Giro', date: 'NA now', mode: 'OCBC CDA Acct' },
              { id: 'd2', no: 2, item: 'Insurance - CI', amount: 200, description: '$2400 - 12 mths from 1st Oct 2022 - 30th Nov 2023', frequency: 'Annually', date: "Nov'23", mode: 'CREDIT CARD OCBC V' },
              { id: 'd3', no: 3, item: 'Insurance - Hospital', amount: 65, description: 'Basic Preferred plan: S$205(CPF Medisave) Medishield: S$130(CPF Medisave) Rider: Deluxe Care: S$441(Cash)', frequency: 'Annually', date: "Apr'23", mode: 'OCBC CC Vincent' },
              { id: 'd4', no: 4, item: 'Milk & Diaper', amount: 200, description: '$34 Silver & $50 Platinum, milk 2 tins a month average', frequency: 'Monthly', date: '-', mode: 'Paynow' },
              { id: 'd5', no: 5, item: 'Miscellaneous', amount: 200, description: 'snacks, supps, etc', frequency: 'Monthly', date: '-', mode: 'Cash / OCBC CC Kelly' },
            ],
          },
        ],
      },
    ],
  },
];
