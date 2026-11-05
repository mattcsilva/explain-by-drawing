"""Preserve local versions of study notes before reconciling an update."""
from pathlib import Path
from datetime import datetime, timezone
import argparse, hashlib, json, uuid

def snapshot(paths, vault):
    VAULT = Path(vault).expanduser().resolve()
    if not VAULT.is_dir():
        raise ValueError('The vault must be an existing directory.')
    targets = []
    for raw in paths:
        path = Path(raw)
        path = (VAULT / path).resolve() if not path.is_absolute() else path.resolve()
        if not path.is_relative_to(VAULT):
            raise ValueError('The file must be inside the study vault.')
        relative = path.relative_to(VAULT)
        if any(part.startswith('.') for part in relative.parts) or path.suffix not in {'.md', '.canvas', '.base'}:
            raise ValueError('Choose notes, canvases or bases outside hidden folders.')
        if path.exists() and not path.is_file():
            raise ValueError('The path must identify a file.')
        targets.append((path, relative))
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ') + '-' + uuid.uuid4().hex[:8]
    destination = VAULT / '.study-history' / stamp
    destination.mkdir(parents=True)
    records = []
    for path, relative in targets:
        exists = path.exists()
        record = {'path': relative.as_posix(), 'existed': exists}
        if exists:
            payload = path.read_bytes()
            saved = destination / relative
            saved.parent.mkdir(parents=True, exist_ok=True)
            saved.write_bytes(payload)
            record['sha256'] = hashlib.sha256(payload).hexdigest()
            assert hashlib.sha256(saved.read_bytes()).hexdigest() == record['sha256']
        records.append(record)
    (destination / 'manifest.json').write_text(json.dumps({'created_utc': stamp, 'files': records}, ensure_ascii=False, indent=2), encoding='utf-8')
    return {'snapshot': str(destination), 'files': len(records)}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--vault', required=True, help='Existing authorized study vault')
    parser.add_argument('paths', nargs='+', help='Paths relative to the study vault, or absolute paths within it')
    args = parser.parse_args()
    print(json.dumps(snapshot(args.paths, args.vault), ensure_ascii=False))
