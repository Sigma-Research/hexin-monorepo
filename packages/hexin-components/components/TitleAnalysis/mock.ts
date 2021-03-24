export default () => [
  {
    node_level: 1,
    node_type: 'chapter',
    node_name: '第一单元 混合运算',
    content: {
      level: 1,
      body: '<p class="align-center">第一单元 混合运算</p>',
    },
    children: [
      {
        node_level: 2,
        node_type: 'chapter',
        node_name: '1.小熊购物',
        content: { level: 2, body: '<p class="align-center">1.小熊购物</p>' },
        children: [
          {
            node_type: 'paragraph',
            content: {
              level: 1,
              body:
                '<p>易错问题：运算顺序错误。</p><p>错例1:&nbsp; $$\\quad2+5\\times 4\\\\=7\\times 4\\\\=28$$（×）&nbsp; $$\\quad6+2\\times 7\\\\=8\\times 7\\\\=56$$ （×）</p><p>分析：乘加或乘减混合运算时，要先算乘法再算加法（减法）。</p><p>改正：$$\\quad2+5\\times 7\\\\=6+1\\\\=37$$（对）&nbsp; &nbsp; $$\\quad6+2\\times 7\\\\=6+15\\\\=20$$（对）</p>',
              tag: '',
              source: '',
            },
            node_level: 3,
            children: [],
          },
          {
            node_level: 3,
            node_type: 'chapter',
            node_name: '针对训练：',
            content: { level: 3, body: '<p>针对训练：</p>' },
            children: [
              {
                node_level: 4,
                node_type: 'question',
                content: {
                  body: '<p>脱式计算（划出先算的部分再计算）</p>',
                  serial_number: '1',
                  sn: 1,
                  level: 1,
                  answer: [],
                  source: '',
                  analysis: '',
                },
                question_type: 'other',
                children: [
                  {
                    node_level: 5,
                    node_type: 'question',
                    content: {
                      body: '<p>$$3+2\\times 6$$</p>',
                      serial_number: '（1）',
                      sn: 1,
                      level: 2,
                      answer: ['$$\\quad3+2\\times 6\\\\=3+12\\\\=15$$'],
                      source: '',
                      analysis: '',
                    },
                    question_type: 'other',
                    children: [],
                  },
                  {
                    node_level: 5,
                    node_type: 'question',
                    content: {
                      body: '<p>$$13-4\\times 2$$</p>',
                      serial_number: '（2）',
                      sn: 2,
                      level: 2,
                      answer: ['$$\\quad13-4\\times 2\\\\=13-8\\\\=5$$'],
                      source: '',
                      analysis: '',
                    },
                    question_type: 'other',
                    children: [],
                  },
                  {
                    node_level: 5,
                    node_type: 'question',
                    content: {
                      body: '<p>$$47-29+11$$</p>',
                      serial_number: '（3）',
                      sn: 3,
                      level: 2,
                      answer: ['$$\\quad47-29+11\\\\=18+11\\\\=29$$'],
                      source: '',
                      analysis: '',
                    },
                    question_type: 'other',
                    children: [],
                  },
                ],
              },
              {
                node_level: 4,
                node_type: 'question',
                content: {
                  body:
                    '<p>三（1）班同学排队做操，如果每行排6人，排成5行，还缺2人，三（1）班一共有多少人排队做操？如果每行排5人，排成5行，还余下多少人？</p>',
                  serial_number: '2',
                  sn: 2,
                  level: 1,
                  answer: [
                    '<p>$$6\\times5-2=28$$（人）$$28-5\\times5=3$$（人）</p><p>答：三（1）班一共有28人排队做操，还余下3人。</p>',
                  ],
                  source: '',
                  analysis:
                    '<p>根据如果每行排6人，排成5行，还缺2人可以算出三(1)班一共有28人，再根据第二个条件算出换一种排法余下的人数。</p>',
                },
                question_type: 'other',
                children: [],
              },
            ],
          },
        ],
      },
      {
        node_level: 2,
        node_type: 'chapter',
        node_name: '2.买文具',
        content: { level: 2, body: '<p class="align-center">2.买文具</p>' },
        children: [
          {
            node_type: 'paragraph',
            content: {
              level: 1,
              body:
                '<p>易错问题：运算顺序错误。</p><p>错例1:&nbsp; $$\\quad12+24\\div 6\\\\=36\\div 6\\\\=6$$（×）&nbsp; $$\\quad32-16\\div 4\\\\=16\\div 4\\\\=4$$（×）</p><p>分析：除加或除减的混合运算，要先算除法再算加法（减法），顺序不能错。</p><p>改正：$$\\quad12+24\\div 6\\\\=12+4\\\\=16$$（√）$$\\quad32-16\\div 4\\\\=32-4\\\\=28$$（√）</p>',
              tag: '',
              source: '',
            },
            node_level: 3,
            children: [],
          },
          {
            node_level: 3,
            node_type: 'chapter',
            node_name: '针对训练：',
            content: { level: 3, body: '<p>针对训练：</p>' },
            children: [
              {
                node_level: 4,
                node_type: 'question',
                content: {
                  body: '<p>脱式计算（划出先算的部分再计算）</p>',
                  serial_number: '1',
                  sn: 1,
                  level: 1,
                  answer: [],
                  source: '',
                  analysis: '',
                },
                question_type: 'other',
                children: [
                  {
                    node_level: 5,
                    node_type: 'question',
                    content: {
                      body: '<p>$$60-30\\div 5$$</p>',
                      serial_number: '（1）',
                      sn: 1,
                      level: 2,
                      answer: ['$$\\quad60-30\\div 5\\\\=60-6\\\\=54$$'],
                      source: '',
                      analysis: '',
                    },
                    question_type: 'other',
                    children: [],
                  },
                  {
                    node_level: 5,
                    node_type: 'question',
                    content: {
                      body: '<p>$$24+24\\div 8$$</p>',
                      serial_number: '（2）',
                      sn: 2,
                      level: 2,
                      answer: ['$$\\quad24+24\\div 8\\\\=24+3\\\\=27$$'],
                      source: '',
                      analysis: '',
                    },
                    question_type: 'other',
                    children: [],
                  },
                ],
              },
              {
                node_level: 4,
                node_type: 'question',
                content: {
                  body:
                    '<p>购物</p><p>跳绳每根6元&nbsp; 水笔10元5支&nbsp; 魔方24元3个</p>',
                  serial_number: '2',
                  sn: 2,
                  level: 1,
                  answer: [],
                  source: '',
                  analysis:
                    '<p>（1） 先算出一支水笔的价钱，再用一根跳绳的价钱减去一支水笔的价钱。</p>\n<p>（2） 先算出一个魔方的价钱，再算出1根跳绳比一个魔方少的价钱。</p>',
                },
                question_type: 'other',
                children: [
                  {
                    node_level: 5,
                    node_type: 'question',
                    content: {
                      body: '<p>一根跳绳比一支水笔贵多少元？</p>',
                      serial_number: '（1）',
                      sn: 1,
                      level: 2,
                      answer: [
                        '<p>$$6-10\\div5=4$$（元） </p><p>答：一根跳绳比一支水笔贵2元.</p>',
                      ],
                      source: '',
                      analysis:
                        '<p>先算出一支水笔的价钱，再用一根跳绳的价钱减去一支水笔的价钱。</p>',
                    },
                    question_type: 'other',
                    children: [],
                  },
                  {
                    node_level: 5,
                    node_type: 'question',
                    content: {
                      body: '<p>一根跳绳比一个魔方便宜多少元？</p>',
                      serial_number: '（2）',
                      sn: 2,
                      level: 2,
                      answer: [
                        '<p>$$24\\div3-6=2$$（元） </p><p>答：一根跳绳比一个魔方便宜2元。</p>',
                      ],
                      source: '',
                      analysis:
                        '<p>先算出一个魔方的价钱，再算出1根跳绳比一个魔方少的价钱。</p>',
                    },
                    question_type: 'other',
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        node_level: 2,
        node_type: 'chapter',
        node_name: '3.过河',
        content: { level: 2, body: '<p class="align-center">3.过河</p>' },
        children: [
          {
            node_type: 'paragraph',
            content: {
              level: 1,
              body:
                '<p>易错问题：解决有小括号的混合运算问题。</p><p>错例1：合唱队男生有15人，女生有17人，把他们平均分成8个小组，每个小组几人？</p><p>错误：$$15+17\\div8=4$$（人）&nbsp; 答：每个小组4人。</p><p>改正：$$(15+17)\\div8=4$$（人）答：每个小组4人。</p><p>分析：先算出总人数，再除以8，要加法先算就要加上小括号，不加小括号，算式就是错误的。</p>',
              tag: '',
              source: '',
            },
            node_level: 3,
            children: [],
          },
          {
            node_level: 3,
            node_type: 'chapter',
            node_name: '针对训练：',
            content: { level: 3, body: '<p>针对训练：</p>' },
            children: [
              {
                node_level: 4,
                node_type: 'question',
                content: {
                  body: '<p>观察算式的运算顺序列出综合算式。</p>',
                  serial_number: '1',
                  sn: 1,
                  level: 1,
                  answer: [],
                  source: '',
                  analysis: '',
                },
                question_type: 'other',
                children: [
                  {
                    node_level: 5,
                    node_type: 'question',
                    content: {
                      body:
                        '<p>$$2\\times6=12$$，$$9+12=21$$ <span data-label="blank" data-blank-length="4"></span></p>',
                      serial_number: '（1）',
                      sn: 1,
                      level: 2,
                      answer: ['$$9+2\\times6=21$$'],
                      source: '',
                      analysis: '',
                      blank_count: 1,
                    },
                    question_type: 'blank',
                    children: [],
                  },
                  {
                    node_level: 5,
                    node_type: 'question',
                    content: {
                      body:
                        '<p>$$24+40=64$$，$$64\\div8=8$$ &nbsp;<span data-label="blank" data-blank-length="4"></span></p>',
                      serial_number: '（2）',
                      sn: 2,
                      level: 2,
                      answer: ['$$(24+40)\\div8=8$$'],
                      source: '',
                      analysis: '',
                      blank_count: 1,
                    },
                    question_type: 'blank',
                    children: [],
                  },
                ],
              },
              {
                node_level: 4,
                node_type: 'question',
                content: {
                  body:
                    '<p><img src="https://xdoc-stable.oss-cn-shanghai.aliyuncs.com/open/088785701f8c8dbe4f1538f8/img/1357021-all/84d932e1fa0f47389bfa7648dba0defe.jpg?x-oss-process=image/resize,p_40"/>每千克5元&nbsp; <img src="https://xdoc-stable.oss-cn-shanghai.aliyuncs.com/open/088785701f8c8dbe4f1538f8/img/1357021-all/bb924aefbe60480c9c51566477c34e18.jpg?x-oss-process=image/resize,p_40"/>每箱50元&nbsp; <img src="https://xdoc-stable.oss-cn-shanghai.aliyuncs.com/open/088785701f8c8dbe4f1538f8/img/1357021-all/7534fc0e0f1743a4a7dfef5ae512be94.jpg?x-oss-process=image/resize,p_40"/>每千克8元</p>',
                  serial_number: '2',
                  sn: 2,
                  level: 1,
                  answer: [],
                  source: '',
                  analysis: '',
                },
                question_type: 'other',
                children: [
                  {
                    node_level: 5,
                    node_type: 'question',
                    content: {
                      body: '<p>桃子和菠萝各买5千克，一共要多少元？</p>',
                      serial_number: '（1）',
                      sn: 1,
                      level: 2,
                      answer: [
                        '<p>方法一：$$5\\times5+5\\times8=65$$（元）</p><p>答：一共要65元.方法二：$$(5+8)\\times5=65$$（元） </p><p>答：一共要65元.</p>',
                      ],
                      source: '',
                      analysis: '',
                    },
                    question_type: 'other',
                    children: [],
                  },
                  {
                    node_level: 5,
                    node_type: 'question',
                    content: {
                      body: '<p>买一箱苹果比买4千克菠萝贵多少元？</p>',
                      serial_number: '（2）',
                      sn: 2,
                      level: 2,
                      answer: [
                        '<p>$$50-4\\times8=18$$（元）</p><p>答：买一箱苹果比买4千克菠萝贵18元。</p>',
                      ],
                      source: '',
                      analysis: '',
                    },
                    question_type: 'other',
                    children: [],
                  },
                  {
                    node_level: 5,
                    node_type: 'question',
                    content: {
                      body:
                        '<p>想一想：算式“$$8+4\\times 5$$”解决的是什么问题？</p>',
                      serial_number: '（3）',
                      sn: 3,
                      level: 2,
                      answer: [
                        '答：解决的是“买1千克菠萝和4千克桃子一共要多少钱？”的问题。',
                      ],
                      source: '',
                      analysis: '',
                    },
                    question_type: 'other',
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]
