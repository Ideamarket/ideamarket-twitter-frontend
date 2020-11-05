import { Sidebar } from 'components'
import { SidebarItemType } from 'components/sidebar'

export default function Help() {
  const items: SidebarItemType[] = [
    {
      title: 'Need Help?',
      value: 'need-help',
      subItems: [
        {
          title: 'Need',
          value: 'need',
        },
        {
          title: 'Help',
          value: 'help',
        },
      ],
    },
    {
      title: 'Contact',
      value: 'contact',
      subItems: [
        {
          title: 'Twitter',
          value: 'twitter',
        },
        {
          title: 'Discord',
          value: 'discord',
        },
      ],
    },
    {
      title: 'Legal & Privacy',
      value: 'legal-and-privacy',
      subItems: [
        {
          title: 'Legal',
          value: 'legal',
        },
        {
          title: 'Privacy',
          value: 'privacy',
        },
      ],
    },
  ]
  return (
    <>
      <Sidebar items={items} />
      <div className="px-6 prose-lg md:px-12 lg:px-16 xl:px-24 md:ml-64">
        <div id="need-help">
          <h2>1. Need Help?</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            officiis odit atque vel deleniti reprehenderit odio saepe, est neque
            rem commodi, ipsum eveniet facere natus veritatis explicabo
            laudantium, veniam maxime. Lorem ipsum dolor, sit amet consectetur
            adipisicing elit. Optio in repudiandae animi pariatur dignissimos,
            ipsum harum porro laborum. Sint iusto quidem repellendus quaerat
            repellat dignissimos optio delectus neque quam dolore. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Possimus officiis odit
            atque vel deleniti reprehenderit odio saepe, est neque rem commodi,
            ipsum eveniet facere natus veritatis explicabo laudantium, veniam
            maxime. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Optio in repudiandae animi pariatur dignissimos, ipsum harum porro
            laborum. Sint iusto quidem repellendus quaerat repellat dignissimos
            optio delectus neque quam dolore.
          </p>
        </div>
        <div id="need">
          <h3>1.1. Need</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            officiis odit atque vel deleniti reprehenderit odio saepe, est neque
            rem commodi, ipsum eveniet facere natus veritatis explicabo
            laudantium, veniam maxime. Lorem ipsum dolor, sit amet consectetur
            adipisicing elit. Optio in repudiandae animi pariatur dignissimos,
            ipsum harum porro laborum. Sint iusto quidem repellendus quaerat
            repellat dignissimos optio delectus neque quam dolore. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Possimus officiis odit
            atque vel deleniti reprehenderit odio saepe, est neque rem commodi,
            ipsum eveniet facere natus veritatis explicabo laudantium, veniam
            maxime. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Optio in repudiandae animi pariatur dignissimos, ipsum harum porro
            laborum. Sint iusto quidem repellendus quaerat repellat dignissimos
            optio delectus neque quam dolore.
          </p>
        </div>
        <div id="help">
          <h3>1.1. Help</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            officiis odit atque vel deleniti reprehenderit odio saepe, est neque
            rem commodi, ipsum eveniet facere natus veritatis explicabo
            laudantium, veniam maxime. Lorem ipsum dolor, sit amet consectetur
            adipisicing elit. Optio in repudiandae animi pariatur dignissimos,
            ipsum harum porro laborum. Sint iusto quidem repellendus quaerat
            repellat dignissimos optio delectus neque quam dolore. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Possimus officiis odit
            atque vel deleniti reprehenderit odio saepe, est neque rem commodi,
            ipsum eveniet facere natus veritatis explicabo laudantium, veniam
            maxime. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Optio in repudiandae animi pariatur dignissimos, ipsum harum porro
            laborum. Sint iusto quidem repellendus quaerat repellat dignissimos
            optio delectus neque quam dolore.
          </p>
        </div>
        <div id="contact">
          <h2>2. Contact</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            officiis odit atque vel deleniti reprehenderit odio saepe, est neque
            rem commodi, ipsum eveniet facere natus veritatis explicabo
            laudantium, veniam maxime. Lorem ipsum dolor, sit amet consectetur
            adipisicing elit. Optio in repudiandae animi pariatur dignissimos,
            ipsum harum porro laborum. Sint iusto quidem repellendus quaerat
            repellat dignissimos optio delectus neque quam dolore. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Possimus officiis odit
            atque vel deleniti reprehenderit odio saepe, est neque rem commodi,
            ipsum eveniet facere natus veritatis explicabo laudantium, veniam
            maxime. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Optio in repudiandae animi pariatur dignissimos, ipsum harum porro
            laborum. Sint iusto quidem repellendus quaerat repellat dignissimos
            optio delectus neque quam dolore.
          </p>
        </div>
        <div id="twitter">
          <h3>2.1 Twitter</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            officiis odit atque vel deleniti reprehenderit odio saepe, est neque
            rem commodi, ipsum eveniet facere natus veritatis explicabo
            laudantium, veniam maxime. Lorem ipsum dolor, sit amet consectetur
            adipisicing elit. Optio in repudiandae animi pariatur dignissimos,
            ipsum harum porro laborum. Sint iusto quidem repellendus quaerat
            repellat dignissimos optio delectus neque quam dolore. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Possimus officiis odit
            atque vel deleniti reprehenderit odio saepe, est neque rem commodi,
            ipsum eveniet facere natus veritatis explicabo laudantium, veniam
            maxime. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Optio in repudiandae animi pariatur dignissimos, ipsum harum porro
            laborum. Sint iusto quidem repellendus quaerat repellat dignissimos
            optio delectus neque quam dolore.
          </p>
        </div>
        <div id="discord">
          <h3>2.1 Discord</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            officiis odit atque vel deleniti reprehenderit odio saepe, est neque
            rem commodi, ipsum eveniet facere natus veritatis explicabo
            laudantium, veniam maxime. Lorem ipsum dolor, sit amet consectetur
            adipisicing elit. Optio in repudiandae animi pariatur dignissimos,
            ipsum harum porro laborum. Sint iusto quidem repellendus quaerat
            repellat dignissimos optio delectus neque quam dolore. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Possimus officiis odit
            atque vel deleniti reprehenderit odio saepe, est neque rem commodi,
            ipsum eveniet facere natus veritatis explicabo laudantium, veniam
            maxime. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Optio in repudiandae animi pariatur dignissimos, ipsum harum porro
            laborum. Sint iusto quidem repellendus quaerat repellat dignissimos
            optio delectus neque quam dolore.
          </p>
        </div>
        <div id="legal-and-privacy">
          <h2>3. Legal {'&'} Privacy</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            officiis odit atque vel deleniti reprehenderit odio saepe, est neque
            rem commodi, ipsum eveniet facere natus veritatis explicabo
            laudantium, veniam maxime. Lorem ipsum dolor, sit amet consectetur
            adipisicing elit. Optio in repudiandae animi pariatur dignissimos,
            ipsum harum porro laborum. Sint iusto quidem repellendus quaerat
            repellat dignissimos optio delectus neque quam dolore. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Possimus officiis odit
            atque vel deleniti reprehenderit odio saepe, est neque rem commodi,
            ipsum eveniet facere natus veritatis explicabo laudantium, veniam
            maxime. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Optio in repudiandae animi pariatur dignissimos, ipsum harum porro
            laborum. Sint iusto quidem repellendus quaerat repellat dignissimos
            optio delectus neque quam dolore.
          </p>
        </div>
        <div id="legal">
          <h3>3.1 Legal</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            officiis odit atque vel deleniti reprehenderit odio saepe, est neque
            rem commodi, ipsum eveniet facere natus veritatis explicabo
            laudantium, veniam maxime. Lorem ipsum dolor, sit amet consectetur
            adipisicing elit. Optio in repudiandae animi pariatur dignissimos,
            ipsum harum porro laborum. Sint iusto quidem repellendus quaerat
            repellat dignissimos optio delectus neque quam dolore. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Possimus officiis odit
            atque vel deleniti reprehenderit odio saepe, est neque rem commodi,
            ipsum eveniet facere natus veritatis explicabo laudantium, veniam
            maxime. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Optio in repudiandae animi pariatur dignissimos, ipsum harum porro
            laborum. Sint iusto quidem repellendus quaerat repellat dignissimos
            optio delectus neque quam dolore.
          </p>
        </div>
        <div id="privacy">
          <h3>3.2 Privacy</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            officiis odit atque vel deleniti reprehenderit odio saepe, est neque
            rem commodi, ipsum eveniet facere natus veritatis explicabo
            laudantium, veniam maxime. Lorem ipsum dolor, sit amet consectetur
            adipisicing elit. Optio in repudiandae animi pariatur dignissimos,
            ipsum harum porro laborum. Sint iusto quidem repellendus quaerat
            repellat dignissimos optio delectus neque quam dolore. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Possimus officiis odit
            atque vel deleniti reprehenderit odio saepe, est neque rem commodi,
            ipsum eveniet facere natus veritatis explicabo laudantium, veniam
            maxime. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Optio in repudiandae animi pariatur dignissimos, ipsum harum porro
            laborum. Sint iusto quidem repellendus quaerat repellat dignissimos
            optio delectus neque quam dolore.
          </p>
        </div>
      </div>
    </>
  )
}
