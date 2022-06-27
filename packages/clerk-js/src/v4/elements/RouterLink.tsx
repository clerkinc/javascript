import { useRouter } from '../../ui/router';
import { Link } from '../customizables';
import { PropsOfComponent } from '../styledSystem';

type RouterLinkProps = PropsOfComponent<typeof Link> & {
  to?: string;
};

export const RouterLink = (props: RouterLinkProps) => {
  console.log(props);
  const { to, onClick: onClickProp, ...rest } = props;
  const router = useRouter();

  const toUrl = router.resolve(to || router.indexPath);

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = e => {
    console.log(e);
    e.preventDefault();
    if (onClickProp && !to) {
      return onClickProp(e);
    }
    return router.navigate(toUrl.href);
  };

  return (
    <Link
      {...rest}
      onClick={onClick}
      href={toUrl.href}
    />
  );
};