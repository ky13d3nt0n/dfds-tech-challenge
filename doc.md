
# Requirements
 - Node
 - PNPM
    - Mac: Install with `brew install pnpm`
 - Prisma

# Project Setup
1. Install dependencies `npm install`
2. Create `.env` file in root of the project - copying over contents from `env.example`
3. Run `npx prisma db push` to generate `db.sqlite` file in `prisma/`
4. Seed the database by running `npx prisma db seed`
5. Run the project with `npm run dev`
6. Visit `http://localhost:3000`

## Task 1 - Create new voyage
- [x] Adds ability to stack elements in layout.
- [x] Adds Create Button - onClick button opens form for creating voyage.
- [x] Adds CreateVoyageForm
  - [x] Date/Time Picker Fields
  - [x] Select Fields
- [x] Adds getAll route for vessels to get back list of options to use in dropdown.
- [x] Adds Toaster notification upon successful creation of voyage.
- [x] Refreshes list of voyages in main table upon successful creation of new voyage.

## Task 2 - Introduce UnitType Relation to Voyage
- [x] Sets up relationship between voyages and unit types in db schema.
- [x] Ran `npx prisma generate` to update the schema.

## Task 3 - Modify the List
- [x] Adds Unit Types column to voyages table.
- [x] Display count of Unit Types and adds popover to see details. Details in name and default length.
- [x] Adds API route for retrieving available Unit Types.
- [x] Adds Unit Type selection within CreateVoyageForm.
  - [x] Adds Form validation to enforce minimum of 5 Unit Types be selected.

## Task 4 - Handling voyage deletion error
- [x] Adds Toaster notification when voyage deletion encounters an error.

## If I could do things differently:
- Investigate further if Prisma can implement minimum of 5 constraints
- Allow for hover state to show popover for Unit Type in table.
- Make it more obvious that the popover is there for Unit Type in table.
- Show Toaster on success of deletion as well to better inform user.
- Wanted to harden datetime fields (have arrival time disable anything before departure time)
- Immediate feedback rather than onSubmit - onBlur would immediately give validation feedback to users.
- Make sure there are not duplicate records upon creation.
- Allow for editing of current list of voyages in case a mistake was made.
- Allow for generic typing - fix issues with current typings.
