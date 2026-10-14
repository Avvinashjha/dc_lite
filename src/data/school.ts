import type { SchoolLesson, SchoolMode, SchoolQuestion, SchoolStream, SchoolSubject } from '../types/school.ts';

export const SCHOOL_MODES: { id: SchoolMode; label: string; description: string; icon: string; color: string }[] = [
  { id: 'play', label: 'Play', description: 'Give your curiosity a playground.', icon: 'play', color: 'peach' },
  { id: 'learn', label: 'Learn', description: 'Small lessons. Big discoveries.', icon: 'book', color: 'mint' },
  { id: 'code', label: 'Code', description: 'Turn little ideas into instructions.', icon: 'code', color: 'lavender' },
  { id: 'quiz', label: 'Quiz', description: 'Smash, Rush, or take time to Think.', icon: 'bolt', color: 'yellow' },
  { id: 'tests', label: 'Tests', description: 'See what you know, subject by subject.', icon: 'check', color: 'blue' },
  { id: 'ask', label: 'Ask', description: 'A little help when you get stuck.', icon: 'chat', color: 'pink' },
];

const allGrades = Array.from({ length: 12 }, (_, i) => i + 1);
export const SCHOOL_SUBJECTS: SchoolSubject[] = [
  { id: 'maths', name: 'Mathematics', symbol: 'π', color: 'lavender', description: 'Patterns, numbers, and new ways to think.', grades: allGrades },
  { id: 'english', name: 'English', symbol: 'Aa', color: 'peach', description: 'Read, imagine, and find your voice.', grades: allGrades },
  { id: 'hindi', name: 'Hindi', symbol: 'अ', color: 'pink', description: 'Explore language, stories, and expression.', grades: allGrades },
  { id: 'world', name: 'The world around us', symbol: '◎', color: 'mint', description: 'People, places, plants, and everyday wonders.', grades: [1, 2, 3, 4, 5] },
  { id: 'science', name: 'Science', symbol: '⚗', color: 'mint', description: 'Ask why. Observe. Make a discovery.', grades: [6, 7, 8, 9, 10] },
  { id: 'social', name: 'Social Science', symbol: '◉', color: 'yellow', description: 'Understand our world and its people.', grades: [6, 7, 8, 9, 10] },
  { id: 'computing', name: 'Computing', symbol: '</>', color: 'blue', description: 'Logic, digital skills, and creative coding.', grades: allGrades },
  { id: 'physics', name: 'Physics', symbol: 'λ', color: 'blue', description: 'Explore motion, energy, and matter.', grades: [11, 12] },
  { id: 'chemistry', name: 'Chemistry', symbol: 'H₂', color: 'mint', description: 'Discover the building blocks of matter.', grades: [11, 12] },
  { id: 'biology', name: 'Biology', symbol: '⌘', color: 'mint', description: 'Investigate living systems.', grades: [11, 12] },
  { id: 'accountancy', name: 'Accountancy', symbol: '≡', color: 'blue', description: 'Understand transactions and financial records.', grades: [11, 12] },
  { id: 'business', name: 'Business Studies', symbol: '↗', color: 'peach', description: 'Explore organisations and management.', grades: [11, 12] },
  { id: 'economics', name: 'Economics', symbol: '₹', color: 'yellow', description: 'Think about choices, resources, and economies.', grades: [11, 12] },
  { id: 'history', name: 'History', symbol: '⌛', color: 'peach', description: 'Investigate the past through evidence.', grades: [11, 12] },
  { id: 'geography', name: 'Geography', symbol: '◎', color: 'mint', description: 'Explore environments and human connections.', grades: [11, 12] },
  { id: 'politics', name: 'Political Science', symbol: '§', color: 'lavender', description: 'Understand institutions, rights, and ideas.', grades: [11, 12] },
  { id: 'psychology', name: 'Psychology', symbol: 'Ψ', color: 'pink', description: 'Study behaviour and mental processes.', grades: [11, 12] },
];

export const SCHOOL_STREAMS: { id: SchoolStream; label: string; detail: string; subjects: string[] }[] = [
  { id: 'all', label: 'All subjects', detail: 'Explore your own combination', subjects: SCHOOL_SUBJECTS.map(s => s.id) },
  { id: 'engineering', label: 'Engineering', detail: 'Physics · Chemistry · Mathematics', subjects: ['physics', 'chemistry', 'maths', 'computing', 'english'] },
  { id: 'medical', label: 'Medical', detail: 'Physics · Chemistry · Biology', subjects: ['physics', 'chemistry', 'biology', 'english'] },
  { id: 'commerce', label: 'Commerce', detail: 'Accountancy · Business · Economics', subjects: ['accountancy', 'business', 'economics', 'maths', 'english'] },
  { id: 'arts', label: 'Arts & Humanities', detail: 'History · Geography · Political Science', subjects: ['history', 'geography', 'politics', 'psychology', 'economics', 'english', 'hindi'] },
];

// Original introductory material. These are starter activities, not a complete
// syllabus or a claim of chapter-by-chapter NCERT alignment. See docs/school.md.
const q = (prompt: string, options: string[], correct: number, explanation: string): SchoolQuestion => ({ prompt, options, correct, explanation });
const lesson = (grade: number, subject: string, id: string, title: string, summary: string, concept: string, example: string, questions: SchoolQuestion[]): SchoolLesson => ({
  id: `c${grade}-${id}`, grade, subject, title, summary, minutes: 5,
  outcome: summary,
  sections: [{ title: 'The big idea', text: concept }, { title: 'Try explaining it', text: 'Describe this idea in your own words. Use the worked example below, then try the practice questions.' }],
  example, questions,
});

export const SCHOOL_LESSONS: SchoolLesson[] = [
  lesson(1, 'maths', 'counting', 'Count a little collection', 'Count objects and connect them to numbers.',
    'Touch each object once as you count: one, two, three. The last number tells you how many objects there are. Adding one more object makes the number one bigger.',
    'You have 3 pencils. A friend gives you 1 more. Count them: 1, 2, 3, 4. Now you have 4 pencils.', [
      q('How many stars? ★ ★ ★', ['2', '3', '4'], 1, 'Count each star once: one, two, three.'),
      q('What number comes after 4?', ['3', '5', '6'], 1, 'Counting forward gives 3, 4, 5. Five comes after four.'),
      q('You have 2 shells and find 1 more. How many now?', ['1', '2', '3'], 2, 'Two and one more makes three.'),
    ]),
  lesson(2, 'maths', 'tens', 'Meet tens and ones', 'Build two-digit numbers using tens and ones.',
    'A group of ten ones makes one ten. In a two-digit number, the digit on the left counts tens and the digit on the right counts ones.',
    '34 is 3 tens and 4 ones: 30 + 4 = 34.', [
      q('How many tens are in 42?', ['2', '4', '42'], 1, 'The tens digit is 4, representing 40.'),
      q('What number is 2 tens and 7 ones?', ['72', '9', '27'], 2, '20 + 7 = 27.'),
      q('Which is 50 + 6?', ['56', '65', '11'], 0, 'Five tens and six ones make 56.'),
    ]),
  lesson(3, 'maths', 'groups', 'Equal groups', 'Use multiplication to count equal groups.',
    'Multiplication is a useful way to count equal groups. Three groups of four means 4 + 4 + 4. We can write this as 3 × 4.',
    'There are 4 baskets with 2 apples in each. 2 + 2 + 2 + 2 = 4 × 2 = 8 apples.', [
      q('3 groups of 2 make…', ['5', '6', '8'], 1, '2 + 2 + 2 = 6.'),
      q('Which matches 4 + 4 + 4?', ['3 × 4', '3 + 4', '4 − 3'], 0, 'There are three equal groups of four.'),
      q('5 bags hold 3 marbles each. How many marbles?', ['8', '10', '15'], 2, '5 × 3 = 15 marbles.'),
    ]),
  lesson(4, 'maths', 'fractions', 'A fair share', 'Describe equal parts of a whole using fractions.',
    'A fraction describes equal parts. The denominator, below the line, tells you the number of equal parts in the whole. The numerator, above the line, tells you how many parts you have.',
    'A sheet is folded into 4 equal parts. Colouring 3 parts colours 3/4 of the sheet.', [
      q('One of four equal parts is…', ['1/4', '4/1', '1/3'], 0, 'One part out of four equal parts is one quarter.'),
      q('In 3/5, how many equal parts make the whole?', ['3', '5', '8'], 1, 'The denominator 5 tells us the total number of equal parts.'),
      q('How many quarters make one whole?', ['2', '3', '4'], 2, 'Four quarters make 4/4, or one whole.'),
    ]),
  lesson(5, 'maths', 'area', 'Measure a rectangle', 'Find area by counting square units.',
    'Area measures the surface inside a shape. Cover a rectangle with equal-sized unit squares. The number of rows multiplied by the number of squares in each row gives its area.',
    'A rectangle 6 cm long and 3 cm wide has area 6 × 3 = 18 square centimetres (cm²).', [
      q('Area of a 4 cm by 3 cm rectangle?', ['7 cm²', '12 cm²', '14 cm²'], 1, 'Area = length × width = 4 × 3 = 12 cm².'),
      q('Which unit measures area?', ['cm', 'cm²', 'kg'], 1, 'Area counts square units, so we use cm².'),
      q('A square has side 5 cm. Its area is…', ['10 cm²', '20 cm²', '25 cm²'], 2, 'A square has equal length and width: 5 × 5 = 25 cm².'),
    ]),
  lesson(6, 'maths', 'equivalent-fractions', 'Different fractions. Same amount.', 'Recognise and create equivalent fractions.',
    'Equivalent fractions represent the same amount. Multiply or divide the numerator and denominator by the same non-zero number to make an equivalent fraction.',
    '1/2 = (1 × 3)/(2 × 3) = 3/6. A half of a chocolate bar is the same amount as three of its six equal pieces.', [
      q('Which fraction equals 1/2?', ['2/3', '3/6', '1/4'], 1, 'Multiply the numerator and denominator of 1/2 by 3 to get 3/6.'),
      q('Complete: 2/3 = ?/12', ['6', '8', '10'], 1, '3 × 4 = 12, so multiply the numerator by 4 too: 2 × 4 = 8.'),
      q('Which fraction is the simplest form of 6/9?', ['2/3', '3/4', '1/3'], 0, 'Divide both 6 and 9 by their common factor 3.'),
    ]),
  lesson(7, 'maths', 'integers', 'Across zero', 'Add positive and negative integers.',
    'On a number line, adding a positive integer moves right and adding a negative integer moves left. Opposite integers, such as 4 and −4, add to zero.',
    'Start at −3. Add 5 by moving five steps right: −2, −1, 0, 1, 2. So −3 + 5 = 2.', [
      q('−4 + 7 = ?', ['−11', '3', '11'], 1, 'Move seven steps right from −4 to reach 3.'),
      q('5 + (−5) = ?', ['10', '−10', '0'], 2, 'A number and its opposite add to zero.'),
      q('−2 + (−3) = ?', ['−5', '1', '5'], 0, 'Move three steps left from −2 to reach −5.'),
    ]),
  lesson(8, 'maths', 'equations', 'Keep it balanced', 'Solve a simple linear equation.',
    'An equation says that two expressions are equal. Doing the same operation to both sides preserves equality. Undo addition or subtraction first, then multiplication or division where appropriate.',
    'Solve 3x + 2 = 14. Subtract 2 from both sides: 3x = 12. Divide both sides by 3: x = 4. Check: 3 × 4 + 2 = 14.', [
      q('Solve x + 5 = 12.', ['5', '7', '17'], 1, 'Subtract 5 from both sides: x = 7.'),
      q('Solve 4x = 20.', ['4', '5', '16'], 1, 'Divide both sides by 4: x = 5.'),
      q('Solve 2x − 3 = 9.', ['3', '6', '12'], 1, 'Add 3 to get 2x = 12, then divide by 2.'),
    ]),
  lesson(9, 'maths', 'polynomials', 'Read a polynomial', 'Identify terms, coefficients, and degree.',
    'A polynomial in x is a sum of terms with non-negative integer powers of x. A coefficient multiplies a power of x. The degree of a non-zero polynomial is the highest power with a non-zero coefficient.',
    'In 3x² + 2x − 7, the coefficient of x² is 3, the constant term is −7, and the degree is 2.', [
      q('What is the degree of 5x³ + 2x + 1?', ['1', '3', '5'], 1, 'The highest power of x is 3.'),
      q('What is the constant term in 2x² − 4?', ['2', '4', '−4'], 2, 'The term without x is −4.'),
      q('Evaluate x² + 2x at x = 3.', ['9', '15', '18'], 1, '3² + 2 × 3 = 9 + 6 = 15.'),
    ]),
  lesson(10, 'maths', 'quadratics', 'Find the roots', 'Solve a quadratic equation by factorisation.',
    'A quadratic equation has the form ax² + bx + c = 0, where a is not zero. If the left side is a product of two factors, at least one factor must be zero.',
    'x² − 5x + 6 = 0 becomes (x − 2)(x − 3) = 0. Therefore x = 2 or x = 3.', [
      q('The roots of (x − 4)(x + 1) = 0 are…', ['4 and −1', '−4 and 1', '4 and 1'], 0, 'Set each factor to zero: x − 4 = 0 or x + 1 = 0.'),
      q('Which is a quadratic equation?', ['x + 2 = 0', 'x² + x − 2 = 0', 'x³ = 8'], 1, 'A quadratic has highest power 2 and a non-zero coefficient for x².'),
      q('The roots of x² − 9 = 0 are…', ['3 only', '−3 only', '3 and −3'], 2, 'x² − 9 = (x − 3)(x + 3). Both 3 and −3 satisfy it.'),
    ]),
  lesson(11, 'maths', 'sets', 'Sets and their relationships', 'Find unions and intersections of finite sets.',
    'A set is a well-defined collection of distinct objects. The union A ∪ B contains elements in either set. The intersection A ∩ B contains only elements in both sets.',
    'For A = {1, 2, 3} and B = {3, 4}, A ∪ B = {1, 2, 3, 4} and A ∩ B = {3}.', [
      q('{1, 2} ∪ {2, 3} equals…', ['{2}', '{1, 2, 3}', '{1, 3}'], 1, 'Include every distinct element from either set.'),
      q('{a, b} ∩ {b, c} equals…', ['{b}', '{a, c}', '{a, b, c}'], 0, 'Only b belongs to both sets.'),
      q('How many elements are in {2, 4, 6}?', ['2', '3', '6'], 1, 'The set contains three distinct elements.'),
    ]),
  lesson(12, 'maths', 'matrices', 'Read a matrix', 'Identify matrix order and add compatible matrices.',
    'A matrix is a rectangular arrangement of entries. Its order is rows × columns. Add matrices of the same order by adding entries in matching positions.',
    'If A = [1, 2] and B = [3, 4], both have order 1 × 2. A + B = [4, 6].', [
      q('A matrix with 2 rows and 3 columns has order…', ['3 × 2', '2 × 3', '6 × 1'], 1, 'Order is written as rows × columns.'),
      q('[2, 5] + [1, 3] equals…', ['[3, 8]', '[2, 15]', '[6, 6]'], 0, 'Add matching entries: 2 + 1 = 3 and 5 + 3 = 8.'),
      q('Which matrices can be added?', ['Any two matrices', 'Matrices with the same order', 'Only square matrices'], 1, 'Every entry needs a matching position, so the orders must agree.'),
    ]),
  lesson(6, 'science', 'water', 'Where did the water go?', 'Distinguish evaporation from condensation.',
    'Evaporation changes liquid water into water vapour at its surface. Condensation changes water vapour into liquid water when it cools sufficiently. Both are changes of state.',
    'A wet cloth dries as water evaporates. Drops on the outside of a cold glass form when water vapour in the surrounding air condenses.', [
      q('A wet shirt dries mainly because of…', ['Freezing', 'Evaporation', 'Condensation'], 1, 'Liquid water on the cloth changes into water vapour.'),
      q('Water drops outside a cold glass come from…', ['Water vapour in the air', 'Water passing through the glass', 'The glass melting'], 0, 'Nearby water vapour cools and condenses on the glass.'),
      q('Condensation changes…', ['Liquid to gas', 'Solid to liquid', 'Gas to liquid'], 2, 'Water vapour becomes liquid water.'),
    ]),
  lesson(6, 'english', 'sentences', 'Who is doing what?', 'Identify the subject and verb in a simple sentence.',
    'The subject tells us who or what a sentence is about. The verb can describe an action or a state. In a simple sentence, finding the verb helps you find who is doing the action.',
    'In “The children paint a mural”, “The children” is the subject and “paint” is the verb.', [
      q('Find the verb: “A bird sings.”', ['A', 'bird', 'sings'], 2, '“Sings” tells us what the bird does.'),
      q('Find the subject: “Riya reads a book.”', ['Riya', 'reads', 'a book'], 0, 'Riya is the person doing the reading.'),
      q('Choose the complete sentence.', ['The bright moon', 'Under the tree', 'The moon shines.'], 2, '“The moon shines” has a subject and a verb and expresses a complete thought.'),
    ]),
  lesson(6, 'hindi', 'sangya', 'नाम वाले शब्द', 'व्यक्ति, स्थान और वस्तु के नाम पहचानें।',
    'किसी व्यक्ति, स्थान, वस्तु या भाव के नाम को संज्ञा कहते हैं। रीमा, दिल्ली, पुस्तक और खुशी संज्ञा के उदाहरण हैं।',
    '“रीमा पुस्तक पढ़ती है।” इस वाक्य में रीमा व्यक्ति का नाम है और पुस्तक वस्तु का नाम है। दोनों संज्ञा हैं।', [
      q('कौन-सा शब्द एक स्थान का नाम है?', ['दौड़ना', 'दिल्ली', 'सुंदर'], 1, 'दिल्ली एक स्थान का नाम है।'),
      q('“मोहन गेंद लाता है।” में वस्तु का नाम क्या है?', ['लाता', 'है', 'गेंद'], 2, 'गेंद एक वस्तु का नाम है।'),
      q('कौन-सा शब्द संज्ञा है?', ['पुस्तक', 'तेज़', 'पढ़ना'], 0, 'पुस्तक एक वस्तु का नाम है, इसलिए यह संज्ञा है।'),
    ]),
  lesson(6, 'social', 'maps', 'Find your way on a map', 'Use directions and a map key.',
    'Maps represent places using symbols. A key explains those symbols. A direction arrow shows north; on a north-up map, east is right, south is down, and west is left.',
    'On a north-up map, a park drawn to the right of your school is east of the school. Always check the direction arrow before deciding.', [
      q('What explains the symbols on a map?', ['The key', 'The border', 'The paper'], 0, 'A map key, or legend, explains its symbols.'),
      q('On a north-up map, the right side is…', ['West', 'East', 'South'], 1, 'When north is at the top, east is on the right.'),
      q('Which direction is opposite north?', ['East', 'West', 'South'], 2, 'North and south are opposite directions.'),
    ]),
  lesson(6, 'computing', 'algorithms', 'A recipe for a computer', 'Put clear instructions in a useful order.',
    'An algorithm is a sequence of instructions for a task. Each step should be clear. Changing the order can change the result. Computers follow the instructions we give them.',
    'To draw a square: move forward, turn right, and repeat that pair of steps four times. Each turn is a quarter turn.', [
      q('An algorithm is…', ['Only a number', 'A sequence of instructions', 'A computer screen'], 1, 'An algorithm describes steps for completing a task.'),
      q('Which instruction is more precise?', ['Move a bit', 'Go somewhere', 'Move forward 3 squares'], 2, 'It states both a direction and an exact distance.'),
      q('Repeating an instruction is called…', ['A loop', 'A picture', 'A password'], 0, 'A loop repeats a step or a group of steps.'),
    ]),
  lesson(11, 'physics', 'units', 'Measure with meaning', 'Distinguish quantities from their SI units.',
    'A measurement combines a numerical value with a unit. Length, mass, and time are base quantities. Their SI units are metre, kilogram, and second. Derived quantities combine base quantities.',
    'An object travels 12 metres in 3 seconds. Its average speed is distance ÷ time = 12/3 = 4 m/s.', [
      q('The SI base unit of mass is…', ['Gram', 'Kilogram', 'Newton'], 1, 'The kilogram is the SI base unit of mass.'),
      q('Speed has SI unit…', ['m/s', 'm × s', 's/m'], 0, 'Speed is distance divided by time.'),
      q('20 m travelled in 5 s gives an average speed of…', ['100 m/s', '25 m/s', '4 m/s'], 2, '20 ÷ 5 = 4 m/s.'),
    ]),
  lesson(12, 'physics', 'charge', 'How charges interact', 'Predict attraction and repulsion between charges.',
    'There are two types of electric charge: positive and negative. Like charges repel; unlike charges attract. For stationary point charges in vacuum, Coulomb’s law gives force magnitude F = k|q₁q₂|/r².',
    'If the distance between two fixed point charges doubles, their force magnitude becomes one quarter because (2r)² = 4r².', [
      q('Two positive charges…', ['Attract', 'Repel', 'Always cancel'], 1, 'Like charges repel each other.'),
      q('If separation doubles, the force becomes…', ['Twice as large', 'Half as large', 'One quarter as large'], 2, 'Force varies inversely with the square of separation.'),
      q('The SI unit of electric charge is…', ['Coulomb', 'Volt', 'Ohm'], 0, 'Electric charge is measured in coulombs.'),
    ]),
  lesson(11, 'biology', 'cells', 'Inside the living cell', 'Recognise a few structures shared by living cells.',
    'Cells are the basic structural and functional units of living organisms. A cell membrane separates the cell from its surroundings. Prokaryotic cells lack a membrane-bound nucleus; eukaryotic cells have one.',
    'A bacterial cell is prokaryotic. A typical onion cell is eukaryotic and has a nucleus, a cell membrane, and a cell wall.', [
      q('Which structure separates a cell from its surroundings?', ['Cell membrane', 'Only the nucleus', 'Only a chromosome'], 0, 'The cell membrane forms the cell’s boundary.'),
      q('A bacterial cell is…', ['Always multicellular', 'Prokaryotic', 'A plant organ'], 1, 'Bacteria are prokaryotes and lack a membrane-bound nucleus.'),
      q('A membrane-bound nucleus is a feature of…', ['All viruses', 'All bacteria', 'Eukaryotic cells'], 2, 'Eukaryotic cells contain a membrane-bound nucleus.'),
    ]),
  lesson(12, 'biology', 'inheritance', 'A first look at inheritance', 'Distinguish genotype from phenotype.',
    'Alleles are alternative forms of a gene. Genotype describes an organism’s genetic constitution at the loci being considered. Phenotype is the observable expression, influenced by genotype and environment.',
    'In a simple complete-dominance model, T is dominant to t. TT and Tt express the dominant phenotype; tt expresses the recessive phenotype.', [
      q('Which genotype is heterozygous?', ['TT', 'Tt', 'tt'], 1, 'Tt contains two different alleles.'),
      q('An observable trait is part of the…', ['Phenotype', 'Gamete only', 'Allele name only'], 0, 'Phenotype refers to observable characteristics.'),
      q('In a Tt × Tt cross, the expected proportion of tt is…', ['1/2', '3/4', '1/4'], 2, 'The equally likely combinations are TT, Tt, tT, and tt.'),
    ]),
  lesson(11, 'accountancy', 'equation', 'The accounting equation', 'Connect assets, liabilities, and capital.',
    'The accounting equation is Assets = Liabilities + Capital. Assets are resources of the business; liabilities are its obligations to outsiders; capital is the owner’s claim. Each recorded transaction preserves this equality.',
    'An owner invests ₹10,000 cash. Assets increase by ₹10,000 and capital increases by ₹10,000.', [
      q('Assets equal…', ['Liabilities + Capital', 'Liabilities − Capital', 'Capital − Expenses'], 0, 'The basic equation is Assets = Liabilities + Capital.'),
      q('Assets are ₹15,000 and liabilities ₹5,000. Capital is…', ['₹20,000', '₹10,000', '₹5,000'], 1, 'Capital = Assets − Liabilities = ₹10,000.'),
      q('A cash loan increases…', ['Only capital', 'Only expenses', 'Assets and liabilities'], 2, 'Cash is an asset and the obligation to repay is a liability.'),
    ]),
  lesson(12, 'accountancy', 'partnership', 'Sharing partnership profits', 'Apply a stated profit-sharing ratio.',
    'A partnership agreement may specify how profits are shared. To divide a profit in a ratio, add the ratio parts, calculate the value of one part, and multiply by each partner’s share. This example assumes no other appropriations.',
    'A and B share ₹20,000 in a 3:2 ratio. Total parts = 5. A receives ₹12,000 and B receives ₹8,000.', [
      q('In a 2:3 ratio, total parts are…', ['1', '5', '6'], 1, 'Add the two parts: 2 + 3 = 5.'),
      q('A receives 3/5 of ₹10,000. How much?', ['₹3,000', '₹5,000', '₹6,000'], 2, '₹10,000 × 3/5 = ₹6,000.'),
      q('Two partners split ₹8,000 equally. Each receives…', ['₹4,000', '₹8,000', '₹2,000'], 0, '₹8,000 ÷ 2 = ₹4,000.'),
    ]),
  lesson(11, 'economics', 'scarcity', 'Choices and opportunity cost', 'Identify the next-best alternative forgone.',
    'Resources such as time are limited, so choices have to be made. Opportunity cost is the value of the next-best alternative you give up when choosing an option.',
    'You have one free hour. Your best alternative to studying economics is playing badminton. If you study, the badminton time is the opportunity cost.', [
      q('Opportunity cost refers to…', ['Every alternative added together', 'The next-best alternative forgone', 'Only money spent'], 1, 'It is the value of the best alternative sacrificed.'),
      q('Which is a scarce resource in the example?', ['Time', 'All possible ideas', 'Numbers'], 0, 'There is only one available hour.'),
      q('Can an activity with no money payment have an opportunity cost?', ['No', 'Only for businesses', 'Yes'], 2, 'It can use time or other resources that have alternative uses.'),
    ]),
  lesson(12, 'economics', 'gdp', 'What does GDP count?', 'Distinguish final goods from intermediate goods.',
    'Gross domestic product measures the value of final goods and services produced within an economy’s domestic territory during a given period. Counting intermediate goods again would double-count value already included in final output.',
    'A baker buys flour for ₹40 and sells bread made from it to a household for ₹70. Counting both ₹40 and ₹70 as final output would count the flour twice.', [
      q('GDP refers to production…', ['Within domestic territory', 'Only by citizens abroad', 'Only in factories'], 0, 'The domestic boundary matters for GDP.'),
      q('Flour bought by a bakery to make bread is…', ['A final household purchase', 'An intermediate good', 'Always excluded from all accounts'], 1, 'It is used as an input into another product.'),
      q('Why avoid counting intermediate goods again?', ['To ignore services', 'To count only imports', 'To avoid double counting'], 2, 'Their value is already reflected in final goods and services.'),
    ]),
  lesson(11, 'history', 'sources', 'Read evidence like a historian', 'Ask useful questions about a historical source.',
    'Historians use evidence such as inscriptions, objects, buildings, and written accounts. Ask who created a source, when, for what purpose, and what it can or cannot tell us. Comparing sources helps test interpretations.',
    'A ruler’s inscription may describe victories. Compare it with other inscriptions and archaeological evidence before accepting every claim.', [
      q('Which can be a historical source?', ['Only printed textbooks', 'An inscription', 'Only modern photographs'], 1, 'Inscriptions can provide evidence about the past.'),
      q('Why ask who created a source?', ['To understand its perspective', 'To avoid reading it', 'To guarantee it is false'], 0, 'The author’s position and purpose can shape the account.'),
      q('Comparing different sources helps us…', ['Ignore evidence', 'Prove every account identical', 'Evaluate interpretations'], 2, 'Agreement and disagreement help us assess claims.'),
    ]),
  lesson(12, 'history', 'archaeology', 'Objects, context, and inference', 'Separate an observation from an interpretation.',
    'Archaeologists examine objects and their contexts: where they were found and what was found nearby. An observation describes evidence. An interpretation proposes what that evidence may mean and must be tested.',
    '“A stone weight was found near a storehouse” is an observation. “It may have been used in trade” is an interpretation that needs supporting evidence.', [
      q('Which is an observation?', ['This object certainly belonged to a king', 'The pot has a painted rim', 'The owner must have been wealthy'], 1, 'The painted rim is a directly describable feature.'),
      q('Why record where an object was found?', ['Its context can inform its meaning', 'Its location is never useful', 'Location proves its owner'], 0, 'Context helps connect an object to other evidence.'),
      q('An interpretation should be…', ['Accepted without evidence', 'Kept unchanged forever', 'Tested against evidence'], 2, 'New evidence can support or change an interpretation.'),
    ]),
];

export const SCHOOL_REFERENCES = [
  { label: 'CBSE curriculum · 2026–27', href: 'https://cbseacademic.nic.in/curriculum_2027.html' },
  { label: 'NCERT textbook library', href: 'https://ncert.nic.in/textbook.php' },
];
