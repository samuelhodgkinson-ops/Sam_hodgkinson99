import { getFlagUrl, getFlagSrcSet } from '@/lib/flags';

type FlagSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeConfig: Record<FlagSize, { width: number; px: number; className: string }> = {
  xs: { width: 20, px: 16, className: 'w-4 h-3' },
  sm: { width: 40, px: 24, className: 'w-6 h-4' },
  md: { width: 40, px: 32, className: 'w-8 h-6' },
  lg: { width: 80, px: 48, className: 'w-12 h-8' },
  xl: { width: 80, px: 64, className: 'w-16 h-11' },
};

export function TeamFlag({ teamId, size = 'md', className = '' }: { teamId: string; size?: FlagSize; className?: string }) {
  const config = sizeConfig[size];
  const src = getFlagUrl(teamId, config.width);
  const srcSet = getFlagSrcSet(teamId, config.width);

  if (!src) {
    return <span className={`inline-block ${config.className} bg-[var(--surface-light)] rounded ${className}`} />;
  }

  return (
    <img
      src={src}
      srcSet={srcSet}
      alt=""
      className={`inline-block ${config.className} object-cover rounded-sm shadow-sm ${className}`}
      loading="lazy"
    />
  );
}
