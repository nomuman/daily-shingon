export function createSnapshotFriendlyRef() {
  const ref = { current: null as null | unknown };
  Object.defineProperty(ref, 'toJSON', {
    value: () => '[React.ref]',
  });
  return ref;
}
