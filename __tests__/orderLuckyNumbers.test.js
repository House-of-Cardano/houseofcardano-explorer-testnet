const num1 = 42;
const num2 = 34;
const num3 = 6;
const num4 = 27;
const num5 = 25;


const luckyNumbers = [];
luckyNumbers.push(
  parseInt(num1),
  parseInt(num2),
  parseInt(num3),
  parseInt(num4),
  parseInt(num5)
);

function orderLuckyNumbers(integerArray) {
    integerArray.sort((a,b) => a - b);
    console.log(integerArray);
    return integerArray;
};

orderLuckyNumbers(luckyNumbers);

const map = new Map();

map.set("key1", luckyNumbers[0]);
map.set("key2", luckyNumbers[1]);
map.set("key3", luckyNumbers[2]);
map.set("key4", luckyNumbers[3]);
map.set("key5", luckyNumbers[4]);

const datum = {
    constructor: 0,
    fields: [
      { bytes: "416363657074" },
      { int: map.get("key1") },
      { int: map.get("key2") },
      { int: map.get("key3") },
      { int: map.get("key4") },
      { int: map.get("key5") },
    ],
  };

  describe(`orderLuckyNumbers`, () => {
    it("orders the lucky numbers from smallest to biggest", () => {
      expect(luckyNumbers[0]).toEqual(6);
      expect(luckyNumbers[1]).toEqual(25);
      expect(luckyNumbers[2]).toEqual(27);
      expect(luckyNumbers[3]).toEqual(34);
      expect(luckyNumbers[4]).toEqual(42);
    });
    it("returns the datum map in in ascending order", () => {
        expect(datum.fields[1].int).toEqual(6);
        expect(datum.fields[2].int).toEqual(25);
        expect(datum.fields[3].int).toEqual(27);
        expect(datum.fields[4].int).toEqual(34);
        expect(datum.fields[5].int).toEqual(42);
    });
  });