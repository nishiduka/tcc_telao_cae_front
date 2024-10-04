import { useState } from 'react';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from 'reactstrap';

type Route = {
  label: string;
  href: string;
  child: Route[];
};

const routes = [
  {
    label: 'Inicio',
    href: '/Dashboard',
    child: [
      {
        label: 'Dashboard',
        href: '/dashboard',
      },
    ],
  },
  {
    label: 'Salas',
    href: '/salas',
    child: [
      {
        label: 'Listagem',
        href: '/salas/listagem',
      },
      {
        label: 'Criar',
        href: '/salas/criar',
      },
    ],
  },
] as Route[];

const Aside = () => {
  const [open, setOpen] = useState('');
  const toggle = (id: string) => {
    if (open === id) {
      setOpen('');
    } else {
      setOpen(id);
    }
  };

  const renderItem = (item: Route) => {
    return (
      <AccordionItem key={item.href}>
        <AccordionHeader targetId={item.href}>{item.label}</AccordionHeader>
        <AccordionBody accordionId={item.href}>
          {item.child.map((child) => (
            <a href={child.href} key={child.href} className="d-block mb-3">
              {child.label}
            </a>
          ))}
        </AccordionBody>
      </AccordionItem>
    );
  };

  return (
    <aside className="mt-5">
      <Accordion flush open={open} toggle={toggle}>
        {routes.map((item) => renderItem(item))}
      </Accordion>
    </aside>
  );
};

export default Aside;
