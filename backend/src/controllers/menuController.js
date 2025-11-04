const MenuItem = require('../models/MenuItem');

exports.getMenu = async (req, res) => {
  try {
    const { program, diet, available = 'true', programType, type } = req.query;
    const query = {};
    if (available !== 'any') query.available = available === 'true';
    const effectiveProgram = program || programType; // alias support
    if (effectiveProgram) query.programs = effectiveProgram;
    const effectiveDiet = diet || (type === 'Veg' ? 'veg' : type === 'Non-Veg' ? 'non-veg' : undefined);
    if (effectiveDiet) query.diet = effectiveDiet;
    const docs = await MenuItem.find(query).lean();
    // Provide 'type' alias in response for compatibility
    const menu = docs.map(d => ({
      ...d,
      type: d.diet === 'non-veg' ? 'Non-Veg' : 'Veg'
    }));
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Return veg and non-veg grouped by program
exports.getMenuByProgram = async (req, res) => {
  try {
    const { program } = req.query;
    if (!program) return res.status(400).json({ message: 'program is required' });
    const [veg, nonVeg] = await Promise.all([
      MenuItem.find({ available: true, programs: program, diet: 'veg' }),
      MenuItem.find({ available: true, programs: program, diet: 'non-veg' })
    ]);
    res.json({ veg, nonVeg });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
