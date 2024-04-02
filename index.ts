import syncDemo from './sync.demo';

console.log('Sync demo', syncDemo);

try {
  const asyncDemo = await import('./async.demo');
  console.log('Async demo', asyncDemo);
}
catch (error) {
  console.error('Error loading async demo', error);
}
