// ===== BASE URL =====
export const API_URL = "http://127.0.0.1:8000";


// ========================================================================
//                            AUTH / LOGIN
// ========================================================================
export async function loginUser(login) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login }),
  });
  return res.json();
}


// ========================================================================
//                            BORROWER API
// ========================================================================

// ---- Profile ----
export async function getCustomerProfile(customerId) {
  const res = await fetch(`${API_URL}/customer/${customerId}`);
  return res.json();
}

export async function updateCustomerProfile(customerId, data) {
  const res = await fetch(`${API_URL}/customer/${customerId}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}


// ---- Dictionaries ----
export async function getCitizenships() {
    const res = await fetch(`${API_URL}/dictionaries/citizenships`);
    return res.json();
  }
  
  export async function getEmploymentTypes() {
    const res = await fetch(`${API_URL}/dictionaries/employment-types`);
    return res.json();
  }
  


// ---- Create Application ----
export async function createApplication(data) {
  const res = await fetch(`${API_URL}/application/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}


// ---- History ----
export async function getMyApplications(customerId) {
  const res = await fetch(`${API_URL}/customer/${customerId}/applications`);
  return res.json();
}



// ========================================================================
//                           MANAGER API
// ========================================================================

// ---- All applications list ----
export async function getApplicationsByStatus(statusId) {
    const res = await fetch(`${API_URL}/manager/by-status/${statusId}`);
    return res.json();
  }  


// ---- Get full application details ----
export async function getApplicationFullDetails(id) {
    const res = await fetch(`${API_URL}/application/details/${id}`);
    return res.json();
  }


// ---- Manager decision ----
export async function createManagerDecision(appId, data) {
    const res = await fetch(`${API_URL}/application/${appId}/decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  
// ---- Credit Product ----
export async function getCreditProduct() {
    const res = await fetch(`${API_URL}/product`);
    return res.json();
  }
  
  export async function updateCreditProduct(id, data) {
    const res = await fetch(`${API_URL}/product/update/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  // ---- Payment Schedule----
  export async function getPaymentSchedule(applicationId) {
    const res = await fetch(`${API_URL}/application/${applicationId}/payments`);
    return res.json();
  }
// ---- Pay Single Schedule Item ----
export async function payScheduleItem(paymentId) {
  const res = await fetch(`${API_URL}/payment/pay/${paymentId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) {
    throw new Error("Payment failed");
  }

  return res.json();
}

  