import PaymentMethod from "../models/PaymentMethod.js";


export const addPaymentMethod = async (req, res, next) => {
    const data=req.body
    console.log(data)
  const {
    type,
    upiName,
    upiId,
    accountHolder,
    accountNumber,
    ifscCode,
    bankName,
    isActive,
  } = req.body;

  // Basic validations
  if (!type) {
    return res.status(400).json({
      success: false,
      message: "Type and Name are required",
    });
  }

  if (!['UPI', 'BANK'].includes(type)) {
    return res.status(400).json({
      success: false,
      message: "Type must be either 'UPI' or 'BANK'",
    });
  }

  // Conditional required fields based on type
  if (type === 'UPI' && !upiId) {
    return res.status(400).json({
      success: false,
      message: "UPI ID is required for type UPI",
    });
  }

  if (type === 'BANK') {
    if (!accountHolder || !accountNumber || !ifscCode || !bankName) {
      return res.status(400).json({
        success: false,
        message: "All bank details are required for type BANK",
      });
    }
  }

  // Check uniqueness on type + name (optional but good)
  const exists = await PaymentMethod.findOne({ type, upiName });
  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Payment method with this type and name already exists",
    });
  }

  const paymentMethod = await PaymentMethod.create({
    type,
    upiName,
    upiId: type === 'UPI' ? upiId : undefined,
    accountHolder: type === 'BANK' ? accountHolder : undefined,
    accountNumber: type === 'BANK' ? accountNumber : undefined,
    ifscCode: type === 'BANK' ? ifscCode : undefined,
    bankName: type === 'BANK' ? bankName : undefined,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    paymentMethod,
    message: "Payment method added successfully",
  });
};

export const getAllPaymentMethods = async (req, res, next) => {
  const paymentMethods = await PaymentMethod.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    paymentMethods,
  });
};

export const deletePaymentMethod = async (req, res, next) => {
  const  id  = req.params.id;
  console.log(id)
  const paymentMethod = await PaymentMethod.findById(req.params.id);

  if (!paymentMethod) {
    // return next(new ErrorHandler(`Payment Method not found with id: ${id}`, 404));
    return res.status(404).json({
    success: false,
    message: `Payment Method not found with id: ${id}`,
  });
  }

  await paymentMethod.deleteOne();

  res.status(200).json({
    success: true,
    message: "Payment method deleted successfully",
  });
};

export const updatePaymentMethod = async (req, res, next) => {
  const { id } = req.params;
  const {
    type,
    upiName,
    upiId,
    accountHolder,
    accountNumber,
    ifscCode,
    bankName,
    isActive,
  } = req.body;

  const paymentMethod = await PaymentMethod.findById(id);
  if (!paymentMethod) {
    // return next(new ErrorHandler(`Payment Method not found with id: ${id}`, 404));
      return res.status(404).json({
    success: false,
    message: `Payment Method not found with id: ${id}`,
  });;
  }

  // Validate type if provided
  if (type && !['UPI', 'BANK'].includes(type)) {
    return res.status(400).json({
      success: false,
      message: "Type must be either 'UPI' or 'BANK'",
    });
  }

  // Conditional required fields based on type
  if (type === 'UPI' && !upiId) {
    return res.status(400).json({
      success: false,
      message: "UPI ID is required for type UPI",
    });
  }

  if (type === 'BANK') {
    if (!accountHolder || !accountNumber || !ifscCode || !bankName) {
      return res.status(400).json({
        success: false,
        message: "All bank details are required for type BANK",
      });
    }
  }

  // Update fields accordingly
  paymentMethod.type = type || paymentMethod.type;
  paymentMethod.upiName = upiName || paymentMethod.upiName;
  paymentMethod.upiId = type === 'UPI' ? upiId : undefined;
  paymentMethod.accountHolder = type === 'BANK' ? accountHolder : undefined;
  paymentMethod.accountNumber = type === 'BANK' ? accountNumber : undefined;
  paymentMethod.ifscCode = type === 'BANK' ? ifscCode : undefined;
  paymentMethod.bankName = type === 'BANK' ? bankName : undefined;
  paymentMethod.isActive = isActive !== undefined ? isActive : paymentMethod.isActive;

  await paymentMethod.save();

  res.status(200).json({
    success: true,
    paymentMethod,
    message: "Payment method updated successfully",
  });
};




export const getPaymentMethodById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const paymentMethod = await PaymentMethod.findById(id);

    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        message: `Payment Method not found with id: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      paymentMethod,
    });
  } catch (error) {
    // agar id invalid format ho ya koi aur error aaye
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
