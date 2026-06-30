const calculateInvoice = (trips = []) => {
  let subtotal = 0;

  const updatedTrips = trips.map((trip) => {
    const totalCharges = Number(trip.totalCharges || 0);
    const dispatchPercentage = Number(trip.dispatchPercentage || trip.dispatchPercent || 0);
    const dispatchAmount = (totalCharges * dispatchPercentage) / 100;

    subtotal += totalCharges;

    return {
      ...trip,
      totalCharges,
      dispatchPercentage,
      dispatchAmount, 
    };
  });


  const tax = 0;
  
  const grandTotal = subtotal;


  return {
    trips: updatedTrips,
    subtotal,
    tax,
    grandTotal,
  };
};

// EXPORT
module.exports = calculateInvoice;