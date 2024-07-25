import {GlobalState, RegistrationState} from '../types/stateTypes'
import {Entry, FieldKg, Lift} from "../types/dataTypes";
import {StateManager} from "../state/stateManager";
import {liftToAttemptFieldName, liftToStatusFieldName, newDefaultEntry} from "../logic/entry";

const stateManager = new StateManager()

const initialState: RegistrationState = {
    // The next unique ID to assign.
    //
    // This is stored in global state to handle the case of deleting registration
    // rows during the course of lifting.
    //
    // A large number is used as the initial value to make it clear that this is
    // specifically not an index into the `entries` array.
    nextEntryId: 5000,

    // Entry objects in the order they appear on the Registration page.
    // This array owns all registration information.
    entries: [],

    // Hash from unique ID to `entries` array index.
    //
    // This is for the benefit of pages other than the Registration page.
    // Because the sort order of the `entries` array can change arbitrarily,
    // the other pages remember globally-unique identifiers for each registration,
    // instead of a simple array index.
    //
    // This lookup table allows mapping those identifiers to whatever
    // the current location of that data is in the canonical `entries` store.
    lookup: {}
}

type NumberLookup = {
    [id: number]: number;
};

export default {
    initialState: initialState,
    newRegistration: (overwriteDefaults: Partial<Entry>) => {
        const state = stateManager.get().registration

        // Generate an entries array with one more item (without modifying the orginal).
        // Object.assign() allows `obj` to overwrite defaults if present.
        const entries: Array<Entry> = state.entries.slice();
        const newEntry = newDefaultEntry(state.nextEntryId);

        // If a previous entry exists, pre-populate some information from it.
        if (entries.length > 0) {
            const previousEntry = entries[entries.length - 1];
            newEntry.day = previousEntry.day;
            newEntry.platform = previousEntry.platform;
            newEntry.flight = previousEntry.flight;
        }

        // Overwrite any newEntry properties with those given in obj.
        entries.push(Object.assign(newEntry, overwriteDefaults));

        // Since a new entry was added, generate a new 'lookup' object,
        // mapping from the globally-unique EntryId to the array index.
        // Specify type explicitly here so that we can mutate it
        const lookup: NumberLookup = Object.assign({}, state.lookup);
        lookup[state.nextEntryId] = entries.length - 1;

        const newRegistrationState = {
            ...state,
            nextEntryId: state.nextEntryId + 1,
            entries: entries,
            lookup: lookup,
        }
        stateManager.saveRegistrationState(newRegistrationState)
    },
    deleteRegistration: (entryId: number) => {
        const state = stateManager.get().registration
        // Generate an entries array without the given item.
        const entries: Array<Entry> = state.entries.filter((item) => item.id !== entryId);

        // Since the entry was deleted from anywhere in the array,
        // construct a new lookup table from scratch.
        const lookup: NumberLookup = {};

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            lookup[entry.id] = i;
        }

        const newRegistrationState = {
            ...state,
            entries: entries,
            lookup: lookup,
        }
        stateManager.saveRegistrationState(newRegistrationState)
    },
    updateRegistration: (entryId: number, changes: Partial<Entry>) => {
        const state = stateManager.get().registration

        // Clone the entries array, since one entry will reference a new object.
        const entries: Array<Entry> = state.entries.slice();

        // Make a new object with just the changes overwritten,
        // and reference that object from the new array.
        const index = entries.findIndex((obj) => obj.id === entryId);
        const newEntry = Object.assign({}, entries[index]);
        entries[index] = Object.assign(newEntry, changes);

        const newRegistrationState = {
            ...state,
            entries: entries,
        }
        stateManager.saveRegistrationState(newRegistrationState)
    },
    enterAttempt: (entryId: number, lift: Lift, attemptOneIndexed: number, weightKg: number) => {
        const state = stateManager.get().registration

        const field: FieldKg = liftToAttemptFieldName(lift);

        // Clone the entries array, since one slot will reference a new object.
        const newEntries: Array<Entry> = state.entries.slice();
        const index = newEntries.findIndex((obj) => obj.id === entryId);
        const oldEntry = newEntries[index];

        // Make a copy of the attempts array containing the new attempt.
        const newarray = oldEntry[field].slice();
        newarray[attemptOneIndexed - 1] = weightKg;

        // Put that new attempts array into an object so we can use Object.assign().
        const newfields: Partial<Entry> = {};
        newfields[field] = newarray;

        // Make a new entry from the old entry, with the attempts field overwritten.
        newEntries[index] = Object.assign(oldEntry, newfields);

        const newRegistrationState = {
            ...state,
            entries: newEntries,
        }
        stateManager.saveRegistrationState(newRegistrationState)
    },
    markLift: (entryId: number, lift: Lift, attemptOneIndexed: number, success: boolean) => {
        const state = stateManager.get().registration

        // Map true to '1' and false to '-1'.
        const status = success === true ? 1 : -1;

        const fieldStatus = liftToStatusFieldName(lift);

        // Clone the entries array, since one slot will reference a new object.
        const newEntries: Array<Entry> = state.entries.slice();
        const index = newEntries.findIndex((obj) => obj.id === entryId);
        const oldEntry = newEntries[index];

        // Make a copy of the status array containing the new status.
        const newarray = oldEntry[fieldStatus].slice();
        newarray[attemptOneIndexed - 1] = status;

        // Put that new array into an object so we can use Object.assign().
        const newfields: Partial<Entry> = {};
        newfields[fieldStatus] = newarray;

        // Make a new entry from the old entry, with the status field overwritten.
        const newEntry = Object.assign({}, oldEntry);
        newEntries[index] = Object.assign(newEntry, newfields);

        const newRegistrationState = {
            ...state,
            entries: newEntries,
        }
        stateManager.saveRegistrationState(newRegistrationState)
    },
    overwriteStore: (store: RegistrationState) => {
        stateManager.saveRegistrationState(store)
    }
}
