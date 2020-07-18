export default {
  part1: {
    nodes: [
      { id: "Artem" },
      { id: "Bjorn" },
      { id: "Cecile" },
      { id: "Dexter" },
      { id: "Ethan" },
      { id: "Fred" },
      { id: "Gabriel" },
      { id: "Houston" },
    ],
    links: [
      { source: "Artem", target: "Cecile", id: "Artem-Cecile" },
      { source: "Ethan", target: "Fred", id: "Ethan-Fred" },
    ],
  },
  part2: {
    nodes: [
      { id: "Ethan" },
      { id: "Fred" },
      { id: "Gabriel" },
      { id: "Houston" },
      { id: "Ian" },
    ],
    links: [
      { source: "Ethan", target: "Fred", id: "Ethan-Fred" },
      { source: "Ian", target: "Gabriel", id: "Ian-Gabriel" },
    ],
  },
};
