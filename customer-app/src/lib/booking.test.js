import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBookingPayload } from './booking.js';

test('buildBookingPayload creates a booking payload with the selected service details', () => {
  const payload = buildBookingPayload({
    customerId: 'customer-1',
    customerName: 'Ava',
    phone: '+1234567890',
    category: 'Electrical',
    subcategory: 'Fan Installation',
    address: '12 Main Street',
    scheduledAt: '2026-08-12T10:00',
    paymentMethod: 'Online Payment'
  });

  assert.equal(payload.customerId, 'customer-1');
  assert.equal(payload.category, 'Electrical');
  assert.equal(payload.subcategory, 'Fan Installation');
  assert.equal(payload.status, 'Pending');
  assert.equal(payload.paymentMethod, 'Online Payment');
});
