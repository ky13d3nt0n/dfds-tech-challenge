
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

# Task 1 - Create new voyage
- Adds ability to stack elements in `Layout` component (prop -> columns:boolean)
- Adds Create Button - onClick button open form for creating voyage
- Adds CreateVoyageForm
  - Date/Time Picker Fields
  - Select Fields
- Adds getAll for vessel to get back list of options to use in dropdown
- Adds Toaster Component upon successfully creating a new voyage
- Refreshes list of voyages in main table
- What I'd Have Done Differently:
  - Wanted to harden datetime fields (have arrival time disable anything before departure time)
  - Better validation - onBlur would immediately give user feedback
  - DB validation, allow for updating/not creating duplicate records (PUT, POST, UPDATE)
  - Allow for editing of current list of voyages in case a mistake was made.

# Task 2 - Introduce UnitType Relation to Voyage
- Sets up connection between voyages and unit types in schema.
- Run `npx prisma generate` to update the schema.
- What I'd Have Done Differently:
  - Investigate further if Prisma can implement minimum of 5 constraints

# Task 3 - Modify the List
- Adds Unit Types column to voyages table.
- Display count of Unit Types and adds popover to see details.
- Adds API route for retrieving all Unit Types.
- Adds Unit Type selection within Create a Voyage form.
- What I'd Have Done Differently:
  - Allow for hover state to show popover.
  - Make it more obvious that the popover is there.

# Task 4 - Handling voyage deletion error
- Adds Toaster notification when voyage cannot be deleted
- What I'd Have Done Differently:
  - Show Toaster on success of deletion as well to better inform user.
