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
    label: 'Agendamento',
    href: '/agendamento',
    child: [
      {
        label: 'Listagem',
        href: '/agendamento/listagem',
      },
      {
        label: 'Criar Agendamento Recorrente',
        href: '/agendamento/criar',
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
  {
    label: 'Cursos',
    href: '/cursos',
    child: [
      {
        label: 'Listagem',
        href: '/cursos/listagem',
      },
      {
        label: 'Criar',
        href: '/cursos/criar',
      },
    ],
  },
  {
    label: 'Materias',
    href: '/materias',
    child: [
      {
        label: 'Listagem',
        href: '/materias/listagem',
      },
      {
        label: 'Criar',
        href: '/materias/criar',
      },
    ],
  },
  {
    label: 'Professores',
    href: '/professores',
    child: [
      {
        label: 'Listagem',
        href: '/professores/listagem',
      },
      {
        label: 'Criar',
        href: '/professores/criar',
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
