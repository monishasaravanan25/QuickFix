export function buildBookingPayload(payload) {
  return {
    customerId: payload.customerId,
    customerName: payload.customerName,
    phone: payload.phone,
    category: payload.category,
    subcategory: payload.subcategory,
    otherDetails: payload.otherDetails || null,
    address: payload.address,
    scheduledAt: payload.scheduledAt,
    paymentMethod: payload.paymentMethod || 'Cash on Delivery',
    status: 'Pending',
    assignedWorkerId: null,
    assignedWorkerName: null,
    assignedWorkerPhone: null,
    assignedWorkerExperience: null,
    assignedWorkerPhoto: null,
    estimatedArrivalAt: null
  };
}
