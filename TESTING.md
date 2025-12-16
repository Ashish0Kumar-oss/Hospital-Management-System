# Testing Guide

## Prerequisites

1. **Install Dependencies:**
```bash
cd Hospital-Management-System/next-shadcn-dashboard-starter
bun install
# or
npm install
```

2. **Start Development Server:**
```bash
bun dev
# or
npm run dev
```

3. **Open Browser:**
Navigate to http://localhost:3000

## Test Checklist

### ✅ Dashboard Tests

1. **View Dashboard**
   - Navigate to `/dashboard/overview`
   - Verify statistics cards are displayed
   - Check that bed availability charts are visible
   - Verify dark theme toggle works

2. **Statistics Display**
   - Check total patients count
   - Verify recovered/deceased/admitted counts
   - Check bed availability numbers
   - Verify doctor count

### ✅ Patient Management Tests

1. **List Patients**
   - Navigate to `/dashboard/patients`
   - Verify patient list displays (should be empty initially)
   - Check "Add Patient" button is visible

2. **Add Patient**
   - Click "Add Patient"
   - Fill in required fields:
     - Name: "John Doe"
     - Phone: "1234567890"
     - Address: "123 Main St"
     - Select a bed
   - Add optional fields:
     - Date of birth
     - Symptoms (select multiple)
     - Assign a doctor
   - Submit form
   - Verify success message
   - Verify redirect to patient list
   - Verify new patient appears in list

3. **View Patient Details**
   - Click on a patient from the list
   - Verify all patient information displays correctly
   - Check bed assignment shows bed number
   - Verify doctor assignment shows doctor name
   - Check symptoms are displayed as badges

4. **Edit Patient**
   - From patient detail page, click "Edit"
   - Modify patient information
   - Submit form
   - Verify changes are saved
   - Verify updated information displays

5. **Discharge Patient**
   - From patient detail page, click "Discharge Patient"
   - Confirm discharge
   - Verify patient status changes to "Discharged"
   - Verify bed becomes available
   - Verify patient appears in list with "Discharged" status

### ✅ Doctor Management Tests

1. **List Doctors**
   - Navigate to `/dashboard/doctors`
   - Verify default doctors are displayed (3 sample doctors)
   - Check doctor cards show specialization, contact info, patient count

2. **Add Doctor**
   - Click "Add Doctor"
   - Fill in form:
     - Name: "Dr. Jane Smith"
     - Specialization: "Cardiologist"
     - Phone: "9876543210"
     - Email: "jane.smith@hospital.com"
   - Submit form
   - Verify success message
   - Verify new doctor appears in list

3. **Edit Doctor**
   - Click "Edit" on a doctor card
   - Modify information
   - Submit form
   - Verify changes are saved

4. **Delete Doctor**
   - Click "Delete" on a doctor with no patients
   - Confirm deletion
   - Verify doctor is removed
   - Try to delete a doctor with patients (should show error)

### ✅ Bed Management Tests

1. **List Beds**
   - Navigate to `/dashboard/beds`
   - Verify bed statistics by type are displayed
   - Check all beds are listed
   - Verify occupied/available status is shown

2. **Add Bed**
   - Click "Add Bed"
   - Fill in form:
     - Bed Number: "B021"
     - Room Number: "R11"
     - Bed Type: "ICU"
   - Submit form
   - Verify success message
   - Verify new bed appears in list

3. **Edit Bed**
   - Click "Edit" on a bed
   - Modify information
   - Submit form
   - Verify changes are saved

4. **Delete Bed**
   - Click "Delete" on an unoccupied bed
   - Confirm deletion
   - Verify bed is removed
   - Try to delete an occupied bed (should show error)

### ✅ Integration Tests

1. **Bed Assignment**
   - Create a new patient
   - Assign a bed
   - Verify bed shows as "Occupied" in bed list
   - Discharge patient
   - Verify bed shows as "Available" again

2. **Doctor Assignment**
   - Create a new patient
   - Assign a doctor
   - Verify doctor's patient count increases
   - Check patient detail page shows doctor name

3. **Dashboard Updates**
   - Add a new patient
   - Verify dashboard statistics update
   - Discharge a patient
   - Verify statistics update again

### ✅ UI/UX Tests

1. **Dark Theme**
   - Toggle dark theme in header
   - Verify all pages work in dark mode
   - Check colors are appropriate
   - Verify text is readable

2. **Responsive Design**
   - Resize browser window
   - Verify layout adapts to mobile/tablet/desktop
   - Check forms are usable on mobile

3. **Animations**
   - Navigate between pages
   - Verify smooth transitions
   - Check hover effects on cards/buttons

4. **Form Validation**
   - Try to submit forms with missing required fields
   - Verify error messages appear
   - Check validation prevents invalid data

### ✅ Error Handling Tests

1. **API Errors**
   - Try to delete a doctor with patients (should show error)
   - Try to delete an occupied bed (should show error)
   - Verify error messages are user-friendly

2. **404 Pages**
   - Navigate to non-existent patient/doctor/bed ID
   - Verify 404 page displays

## Expected Behavior

### Initial State
- 3 default doctors
- 20 default beds (various types)
- 0 patients

### After Adding Patient
- Patient count increases
- Selected bed becomes occupied
- Doctor's patient count increases (if assigned)
- Dashboard statistics update

### After Discharging Patient
- Patient status changes to "Discharged"
- Bed becomes available
- Patient count may decrease (depending on filtering)

## Common Issues & Solutions

### Issue: "Module not found" errors
**Solution:** Run `bun install` or `npm install` to install dependencies

### Issue: Data not persisting
**Solution:** Check that `data/` directory exists and has write permissions

### Issue: Forms not submitting
**Solution:** Check browser console for errors, verify API routes are working

### Issue: Dark theme not working
**Solution:** Clear browser cache, check theme provider is configured

## Performance Checks

1. **Page Load Times**
   - Dashboard should load in < 2 seconds
   - Patient list should load in < 1 second
   - Forms should be responsive

2. **Data Operations**
   - Adding patient should complete in < 1 second
   - Loading patient details should be instant
   - Dashboard stats should update quickly

## Browser Compatibility

Test in:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Notes

- All data is stored in JSON files in the `data/` directory
- Data persists between server restarts
- No database setup required for testing
- Clerk authentication is optional (can work without it)

